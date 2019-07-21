import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Book } from "shared/book";
import { SearchRequest, SearchResponse, BookQuery } from "./listing";
import { Observable } from "rxjs";
import { bookAPI, autoCompletion } from "./constants";
import { map, finalize, take } from "rxjs/operators";

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

class SearchObservable extends Observable<Book> {
  constructor(...arr: any[]) {
    super(...arr);
  }


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
  request<T>(url: URL | any, options: RequestOptions = {}) {
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
    return this.searchBooks(req).then(obj => obj.items[0]);
  }

  createObservableForSearch(query: string, params?: SearchParams): Observable<Book>;
  createObservableForSearch(request: SearchRequest | BookQuery): Observable<Book>;
  createObservableForSearch(request: SearchRequest | BookQuery | string, params?: SearchParams): Observable<Book> {
    const req = makeSearchRequest(request, params);
    let json: GoogleAPI.VolumesList;
    let count = 0;
    return new Observable<Book>((subscriber) => {
      (async () => {
        try {
          do {
            json = await this.request(req).toPromise();
            for (const data of json.items) {
              if (req.filter(data)) {
                subscriber.next(new Book(data));
              }
            }
            count += json.items.length;
          }
          while (count < req.maxResults && json.items.length > 0);
        } catch (e) {
          subscriber.error(e);
        }
        subscriber.complete();
      })();
    });
  }

  async searchBooks(query: string, params?: SearchParams): Promise<SearchResponse>;
  async searchBooks(request: SearchRequest | BookQuery): Promise<SearchResponse>;
  async searchBooks(request: SearchRequest | BookQuery | string, params?: SearchParams): Promise<SearchResponse> {
    const books: Book[] = [];
    let json: GoogleAPI.VolumesList;
    let totalItems: number;

    request = makeSearchRequest(request, params);
    const newReq = request.clone();
    do {
      try {
        json = await this.request(newReq).toPromise();
        if (!totalItems) {
          totalItems = json.totalItems;
        }
        if (json.items) {
          for (const data of json.items) {
            if (request.filter(data)) {
              books.push(new Book(data));
            }
          }
        } else {
          break;
        }
      } catch (e) {
        console.error(e);
        console.log("JSON--------------------------------------------");
        console.log(json);
        break;
      }
      newReq.startIndex += json.items.length;
    } while (books.length < request.maxResults && (json.totalItems - json.items.length) > 0);

    return {
      request,
      items: books,
      startIndex: request.startIndex,
      next: newReq,
      totalItems
    };
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
        return {};
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
      return;
    }
    return this.getVolumeByURL(book.selfLink).subscribe(newBook => {
      book.imageLinks = newBook.imageLinks;
    });
  }
}
