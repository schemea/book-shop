import { Book } from "shared/book";
import { bookAPI } from "./constants";


export interface SearchResponse {
  request: SearchRequest;
  items: Book[];
  next: SearchRequest;
  startIndex: number;
  totalItems: number;
}
export class BookQuery {

  constructor(query?: string) {
    this.keywords = query || "";
  }
  intitle: string;
  inauthor: string;
  inpublisher: string;
  subject: string;
  isbn: string;
  lccn: string;
  oclc: string;
  keywords: string;

  static unserialize(data: any): BookQuery {
    return Object.assign(Object.create(BookQuery.prototype), data);
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

export class Filter<T> {

  constructor(path: string, value: any, operation: Filter<T>["operation"]) {
    this.path = path;
    this.value = value;
    this.operation = operation;
  }
  path: string;
  value: any;
  operation: "equal" | "not_equal";

  static unserialize<T>(data: any): Filter<T> {
    const filter = Object.assign(Object.create(Filter.prototype), data);
    return filter;
  }

  static apply<T>(filters: Filter<T>[], target: T) {
    return !filters.some(filter => !filter.apply(target));
  }

  apply(target: T) {
    const value = this.path.split(".").reduce((prev, curr) => prev[curr], target);
    switch (this.operation) {
      case "equal":
        return this.value === value;
      case "not_equal":
        return this.value !== value;
      default:
        throw new Error(this.operation + " is not a valid operation");
    }
  }
}

export class SearchRequest {
  query: BookQuery;
  filters: Filter<GoogleAPI.VolumeResource>[] = [];

  static unserialize(request: any): SearchRequest {
    const req: SearchRequest = Object.assign(Object.create(SearchRequest.prototype), request);
    req.filters = req.filters.map(Filter.unserialize);
    req.query = BookQuery.unserialize(req.query);
    return req;
  }

  constructor(query?: BookQuery | string, public startIndex: number = 0, public maxResults?: number) {
    this.query = query instanceof BookQuery ? query : new BookQuery(query);
  }

  clone(): SearchRequest {
    return Object.assign(Object.create(SearchRequest.prototype), this);
  }

  toURL() {
    const url = new URL("volumes", bookAPI);
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
