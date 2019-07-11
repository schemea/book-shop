import { Injectable } from '@angular/core';

const baseURL = 'https://www.googleapis.com/books/v1/';

export class SearchResponse {
  request: SearchRequest;
  items: Book[];
  next: SearchRequest;
  startIndex: number;
  totalItems: number;
}


export class BookQuery {
  intitle: string;
  inauthor: string;
  inpublisher: string;
  subject: string;
  isbn: string;
  lccn: string;
  oclc: string;
  keywords: string;

  constructor(query?: string) {
    this.keywords = query;
  }

  toString() {
    let query = this.keywords;
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (key !== 'keywords' as keyof BookQuery && value) {
          query += '+' + key + ':' + value;
        }
      }
    }
    return query;
  }
}

export class SearchRequest {
  query: BookQuery;

  constructor(query: BookQuery | string, public startIndex?: number, public maxResults?: number) {
    this.query = query instanceof BookQuery ? query : new BookQuery(query);
  }

  clone() {
    return Object.assign(Object.create(SearchRequest.prototype), this);
  }

  toString() {
    let query = baseURL + 'volumes?q=' + this.query.toString();
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (key !== 'query' as keyof SearchRequest && value) {
          query += '&' + key + '=' + value;
        }
      }
    }
    return query;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAPIService {

  constructor() { }

  async searchBooks(request: SearchRequest | BookQuery | string): Promise<SearchResponse> {
    const books: Book[] = [];
    let json: GoogleAPI.SearchResponse;
    let totalItems: number;

    const req = request instanceof SearchRequest ? request : new SearchRequest(request);

    json = await fetch(req.toString()).then(x => x.json());
    if (!totalItems) {
      totalItems = json.totalItems;
    }
    for (const data of json.items) {
      const book: Book = { identifiers: new Map() } as Book;
      const volumeInfo = data.volumeInfo;

      Object.assign(book, {
        authors: volumeInfo.authors,
        title: volumeInfo.title,
        description: volumeInfo.description,
        imageLinks: volumeInfo.imageLinks,
        rating: volumeInfo.ratingsCount,
        pageCount: volumeInfo.pageCount,
        language: volumeInfo.language
      });
      if (volumeInfo.industryIdentifiers) {
        for (const id of volumeInfo.industryIdentifiers) {
          book.identifiers.set(id.type, id.identifier);
        }
      }
      books.push(book);
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
}
