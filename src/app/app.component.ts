import { Component, AfterViewInit } from "@angular/core";
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
export class AppComponent implements AfterViewInit {
  title = "book-shop";
  books: Book[];
  searchQuery: string;

  constructor(private gapi: GoogleAPIService) {
    
  }

  search() {
    this.gapi.searchBooks(this.searchQuery, { maxResults: 100 }).then(resp => {
      this.books = resp.items;
    });
  }

  ngAfterViewInit(): void {
    // M.Modal.init(document.querySelectorAll(".modal"));
  }
}
