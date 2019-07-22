import { Component, AfterViewInit, HostBinding, OnInit, ElementRef, AfterContentInit, ViewChild, OnDestroy } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";
import { child, fadeNoTransform } from "shared/animations";
import { delay, mergeMap, concatMap, subscribeOn } from "rxjs/operators";
import { of, Subscription } from "rxjs";
import { SearchObservable } from "./services/google-api/search";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [
    GoogleAPIService
  ],
  animations: [
    child,
    fadeNoTransform
  ]
})
export class AppComponent implements OnDestroy {
  title = "book-shop";
  books: Book[];
  loading: boolean;

  searchContext: {
    observable: SearchObservable,
    subscribtion: Subscription,
    query: string
  };

  constructor(private gapi: GoogleAPIService) { }

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

  search(keywords: string) {
    if (this.searchContext && this.searchContext.query === keywords) {
      return;
    }
    this.loading = true;
    const books = this.books = [];
    const app = this;
    this.abortSearch();
    this.searchContext = { query: keywords } as AppComponent["searchContext"];
    this.searchContext.observable = this.gapi.searchBooks(keywords, {
      maxResults: 100,
      filter: (volume) => volume.saleInfo.saleability !== "NOT_FOR_SALE"
    });
    this.searchContext.subscribtion = this.searchContext.observable.pipe(
      concatMap(book => of(book).pipe(delay(150)))
    ).subscribe({
      next(book) {
        books.push(book);
        app.loading = false;
      }
    });
  }

}
