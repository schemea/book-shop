import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Book } from "shared/book";
import { SearchRequest, SearchResponse, BookQuery } from "./listing";
import { Observable } from "rxjs";
import { baseURL } from "./constants";
import { map, finalize } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class GoogleAPIService {

  constructor(private http: HttpClient) { }

  request<T>(url: SearchRequest): Observable<GoogleAPI.VolumesList>;
  request<T>(url: URL | string, params?: { [key: string]: string | number }): Observable<T>;
  request<T>(url: URL | string | { toString: () => string }, params?: { [key: string]: string | number }): Observable<T> {
    if (!(url instanceof URL)) {
      url = new URL(url as string);
    }
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          (url as URL).searchParams.set(key, params[key] as string);
        }
      }
    }
    (url as URL).searchParams.set("key", "AIzaSyBRxgiq3B_RjVUl8CA4SisAJmKGrzt7xgQ");
    return this.http.get(url.toString()) as Observable<T>;
  }

  async getBookByISBN(value: string) {
    if (value.length !== 13 && value.length !== 10) {
      throw new Error(value + " is not a valid ISBN");
    }
    const req = new SearchRequest();
    req.query.isbn = value;
    return this.searchBooks(req).then(obj => obj.items[0]);
  }

  async searchBooks(query: string, params?: SearchRequest): Promise<SearchResponse>;
  async searchBooks(request: SearchRequest | BookQuery): Promise<SearchResponse>;
  async searchBooks(request: SearchRequest | BookQuery | string, params?: SearchRequest): Promise<SearchResponse> {
    const books: Book[] = [];
    let json: GoogleAPI.VolumesList;
    let totalItems: number;

    let req = request instanceof SearchRequest ? (params ? request.clone() : request) : new SearchRequest(request);
    if (params) {
      req = Object.assign(req, params);
    }
    try {
      json = await this.request(req).toPromise();
      if (!totalItems) {
        totalItems = json.totalItems;
      }
      if (json.items) {
        for (const data of json.items) {
          books.push(new Book(data));
        }
      }
    } catch (e) {
      console.error(e);
      console.log("JSON--------------------------------------------");
      console.log(json);
    }

    const next = req.clone();
    next.startIndex = req.startIndex + books.length;
    return {
      request: req,
      items: books,
      startIndex: req.startIndex,
      next,
      totalItems
    };
  }

  getVolumeByURL(url: string) {
    return this.request(url).pipe(
      map<GoogleAPI.VolumeResource, Book>(book => new Book(book))
    );
  }

  getVolumeByID(id: string) {
    return this.getVolumeByURL(baseURL + "volumes/" + id);
  }

  retrieveHighResThumbnails(book: Book) {
    return this.getVolumeByURL(book.selfLink).subscribe(newBook => {
      book.imageLinks = newBook.imageLinks;
    });
  }
}
