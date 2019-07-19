import { Component, AfterViewInit } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";
import { SearchRequest } from "./services/google-api/listing";
// import "materialize-css/dist/js/materialize.min.js";
// import "materialize-css/dist/css/materialize.css";
// import M from "materialize-css";
import "node-waves/dist/waves.min.js";
import "node-waves/dist/waves.min.css";

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
  constructor(private gapi: GoogleAPIService) {
    // gapi.request(new URL('https://www.googleapis.com/books/v1/volumes?q=Alice'), {}).then(console.log).catch(console.error);
    gapi.searchBooks("Alice", { maxResults: 100 }).then(resp => {
      this.books = resp.items;
    });
  }
  ngAfterViewInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    // M.AutoInit();
  }
}
