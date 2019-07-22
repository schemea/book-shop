import { Component, AfterViewInit, HostBinding, OnInit, ElementRef, AfterContentInit, ViewChild } from "@angular/core";
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
export class AppComponent {
  title = "book-shop";
  books: Book[];
  searchQuery: string;
  loading: boolean;

  searchContext: {
    observable: SearchObservable,
    subscribtion: Subscription
  };

  constructor(private gapi: GoogleAPIService) { }

  search(keywords: string) {
    this.loading = true;
    const books = this.books = [];
    const app = this;
    if (this.searchContext) {
      this.searchContext.observable.abort();
      this.searchContext.subscribtion.unsubscribe();
    }
    this.searchContext = {} as any;
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
