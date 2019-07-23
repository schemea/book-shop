import { Component, OnInit, OnDestroy } from "@angular/core";
import { Book } from "shared/book";
import { SearchObservable } from "app/services/google-api/search";
import { Subscription, of } from "rxjs";
import { GoogleAPIService } from "app/services/google-api";
import { delay, concatMap } from "rxjs/operators";
import { fade } from "shared/animations";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  animations: [
    fade
  ]
})
export class SearchComponent implements OnDestroy {

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
    let books: Book[];
    const app = this;
    this.abortSearch();
    this.searchContext = { query: keywords } as SearchComponent["searchContext"];
    this.searchContext.observable = this.gapi.searchBooks(keywords, {
      maxResults: 100,
      filter: (volume) => volume.saleInfo.saleability !== "NOT_FOR_SALE"
    });
    this.searchContext.subscribtion = this.searchContext.observable.pipe(
      concatMap(book => of(book).pipe(delay(200)))
    ).subscribe({
      next(book) {
        if (!books) {
          books = app.books = [];
        }
        books.push(book);
        app.loading = false;
      }
    });
  }
}
