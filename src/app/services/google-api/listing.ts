import { Book } from "shared/book";
import { baseURL } from "./constants";


export interface SearchResponse {
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
    this.keywords = query || "";
  }

  toString() {
    let query = this.keywords;
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (key !== "keywords" as keyof BookQuery && value) {
          query += "+" + key + ":" + value;
        }
      }
    }
    return query;
  }
}

export class SearchRequest {
  query: BookQuery;
  filter = (book: GoogleAPI.VolumeResource) => true;

  constructor(query?: BookQuery | string, public startIndex: number = 0, public maxResults?: number) {
    this.query = query instanceof BookQuery ? query : new BookQuery(query);
  }

  clone(): SearchRequest {
    return Object.assign(Object.create(SearchRequest.prototype), this);
  }

  toURL() {
    const url = new URL("volumes", baseURL);
    url.searchParams.set("q", this.query.toString());

    const keys: (keyof SearchRequest)[] = ["startIndex", "maxResults"];
    url.searchParams.set("startIndex", this.startIndex.toString());
    url.searchParams.set("maxResults", Math.min(this.maxResults, 40).toString());
    return url;
  }

  toString() {
    return this.toURL().toString();
  }
}
