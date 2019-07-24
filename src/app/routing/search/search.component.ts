import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { Book } from "shared/book";
import { SearchObservable } from "app/services/google-api/search";
import { Subscription, of } from "rxjs";
import { GoogleAPIService } from "app/services/google-api";
import { delay, concatMap } from "rxjs/operators";
import { fade } from "shared/animations";
import { SearchRequest, Filter } from "app/services/google-api/listing";
import { SearchState } from "./state";
import { SearchInputComponent } from "app/search-input/search-input.component";


const resultsPerPage = 10;
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  animations: [
    fade
  ]
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
  loading: boolean;

  @ViewChild("input", { read: SearchInputComponent, static: false }) input: SearchInputComponent;

  state: SearchState;

  searchContext: {
    observable: SearchObservable,
    subscribtion: Subscription
  };

  constructor(private gapi: GoogleAPIService) { }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    window.addEventListener("popstate", event => {
      this.onStateChange(new SearchState(event.state));
    });

    this.state = new SearchState(history.state);
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.onStateChange(new SearchState(history.state));
    this.input.input.nativeElement.focus();

  }

  onStateChange(state: SearchState) {
    console.log(state);
    this.state = state;

    if (this.searchContext && this.searchContext.subscribtion) {
      this.searchContext.subscribtion.unsubscribe();
    }


    // if (!state) {
    //   return;
    // }
    // this.input.value = state.request || "";
    // this.input.input.nativeElement.dispatchEvent(new FocusEvent(this.input.value ? "focus" : "blur"));
    // console.log(this.input.value);

    // this.books = state.books ? state.books.map(Book.unserialize) : [];
    // document.title = this.input.value + " - Book Search";
  }

  abortSearch() {
    if (this.searchContext) {
      this.searchContext.observable.abort();
      this.searchContext.subscribtion.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

    this.abortSearch();
  }

  onPageChange(page: number) {
    if (this.state.request) {
      const request = this.state.request.clone();
      request.startIndex = (page - 1) * resultsPerPage;
      this.search(request);
    }
  }

  onSearch(query: string) {
    const request = new SearchRequest(query);
    request.maxResults = resultsPerPage;
    this.search(request);
  }

  search(request: SearchRequest) {
    const component = this;

    request.filters = [new Filter("saleInfo.saleability", "NOT_FOR_SALE", "not_equal")];

    if (this.state.request && this.state.request.toString() === request.toString()) {
      return;
    }
    this.loading = true;
    let books: Book[];
    this.abortSearch();
    this.searchContext = {} as SearchComponent["searchContext"];
    this.searchContext.observable = this.gapi.searchBooks(request);
    document.title = request + " - Book Search";
    const state = this.state;
    state.request = request;
    state.books = [];

    history.pushState(state, document.title, window.location.href);
    this.searchContext.subscribtion = this.searchContext.observable.pipe(
      concatMap(book => of(book).pipe(delay(100)))
    ).subscribe({
      next(book) {
        if (!books) {
          books = state.books = [];
        }
        books.push(book);
        component.loading = false;
        history.replaceState(state, document.title, window.location.href);
      }
    });
  }
}
