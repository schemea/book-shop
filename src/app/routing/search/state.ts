import { SearchRequest } from "app/services/google-api/listing";
import { Book } from "shared/book";

type SearchComponent = import("./search.component").SearchComponent;

interface Constructor<T, Arg> {
  readonly prototype: any;
  unserialize: (data: Arg) => T;
}

function unserialize<T>(data: any, constructor: Constructor<T, typeof data>, defaultValue: T) {
  return data && constructor.unserialize(data) || defaultValue;
}
function unserializeArray<T>(data: any[], constructor: Constructor<T, any>, defaultValue: T[]) {
  return data && data.map(constructor.unserialize) || defaultValue;
}

export class SearchState {
  books: { [k: string]: string | number | any }[];
  request: SearchRequest;
  input: string;
  page: number;

  constructor(state: SearchState | { [k: string]: any }) {
    if (!state) {
      state = { };
    }
    this.books = unserializeArray(state.books, Book, []);
    this.request = unserialize(state.request, SearchRequest, null);
    this.input = state.input || "";
    this.page = state.page || 1;
  }
}
