import { Component, AfterViewInit, HostBinding, OnInit, ElementRef, AfterContentInit, ViewChild } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";
import { child, fadeNoTransform } from "shared/animations";

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

  constructor(private gapi: GoogleAPIService) { }

  search(keywords: string) {
    this.loading = true;
    this.gapi.searchBooks(keywords, { maxResults: 100 }).then(resp => {
      this.loading = false;
      const data = resp.items.filter(book => book.saleability !== "NOT_FOR_SALE");
      this.books = data;
    });
  }

}
