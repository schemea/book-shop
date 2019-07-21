import { Component, AfterViewInit, HostBinding, OnInit, ElementRef, AfterContentInit } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [
    GoogleAPIService
  ]
})
export class AppComponent {
  title = "book-shop";
  books: Book[];
  searchQuery: string;

  constructor(private gapi: GoogleAPIService) { }

  search(keywords: string) {
    this.gapi.searchBooks(keywords, { maxResults: 100 }).then(resp => {
      this.books = resp.items;
    });
  }
}
