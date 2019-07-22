import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Book } from "shared/book";
import { SearchRequest, SearchResponse, BookQuery } from "./listing";
import { Observable } from "rxjs";
import { bookAPI, autoCompletion } from "./constants";
import { map, take } from "rxjs/operators";
import { SearchObservable } from "./search";

type SearchParams = {
  [k in keyof SearchRequest]?: SearchRequest[k]
};

function makeSearchRequest(request: SearchRequest | BookQuery | string, params: SearchParams): SearchRequest {
  let req = request instanceof SearchRequest ? (params ? request.clone() : request) : new SearchRequest(request);
  if (params) {
    req = Object.assign(req, params);
  }
  return req;
}

interface RequestOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: any;
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: any;
  withCredentials?: boolean;
}
@Injectable({
  providedIn: "root"
})
export class GoogleAPIService {

  constructor(private http: HttpClient) { }

  request(url: SearchRequest): Observable<GoogleAPI.VolumesList>;
  request<T>(url: URL | string, options?: RequestOptions): Observable<T>;
  request(url: URL | any, options: RequestOptions = {}) {
    if (!(url instanceof URL)) {
      url = new URL(url as string, window.location as any);
    }
    for (const key in options.params) {
      if (options.params.hasOwnProperty(key)) {
        (url as URL).searchParams.set(key, options.params[key] as string);
      }
    }
    return this.http.get(url.toString(), options);
  }

  async getBookByISBN(value: string) {
    if (value.length !== 13 && value.length !== 10) {
      throw new Error(value + " is not a valid ISBN");
    }
    const req = new SearchRequest();
    req.query.isbn = value;
    return this.searchBooks(req);
  }

  searchBooks(query: string, params?: SearchParams): SearchObservable;
  searchBooks(request: SearchRequest | BookQuery): SearchObservable;
  searchBooks(request: SearchRequest | BookQuery | string, params?: SearchParams): SearchObservable {
    const req = makeSearchRequest(request, params);
    const obs = new SearchObservable(this);
    obs.start(req);
    return obs;
  }

  fetchAutocompletion(query: string): Observable<[string, string][]> {
    return this.request<string>(
      "/proxy/" + autoCompletion + query,
      {
        responseType: "text"
      }
    ).pipe(
      map(script => {
        const regex = /\[([\s,]*\[[^\[\]]+\])+\s*\]/;
        const match = regex.exec(script);
        if (match) {
          const arr = JSON.parse(match[0]);
          return arr;
        }
        return [];
      }));
  }

  getVolumeByURL(url: string) {
    return this.request(url).pipe(
      take(1),
      map<GoogleAPI.VolumeResource, Book>(book => new Book(book))
    );
  }

  getVolumeByID(id: string) {
    return this.getVolumeByURL(bookAPI + "volumes/" + id);
  }

  retrieveHighResThumbnails(book: Book) {
    if (Object.keys(book.imageLinks).length > 2) {
      return null;
    }
    return this.getVolumeByURL(book.selfLink).subscribe(newBook => {
      book.imageLinks = newBook.imageLinks;
    });
  }
}
