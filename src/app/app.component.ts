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
export class AppComponent implements AfterContentInit {
  title = "book-shop";
  books: Book[];
  searchQuery: string;

  constructor(private gapi: GoogleAPIService, private ref: ElementRef<HTMLElement>) {
    ref.nativeElement.classList.add("loading-dom");
  }

  ngAfterContentInit(): void {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.

    this.ref.nativeElement.classList.remove("loading-dom");
  }

  search(keywords: string) {
    this.gapi.searchBooks(keywords, { maxResults: 100 }).then(resp => {
      this.books = resp.items;
    });
  }
}
