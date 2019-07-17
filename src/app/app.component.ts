import { Component } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
  providers: [
    GoogleAPIService
  ]
})
export class AppComponent {
  title = "book-shop";
  books: Book[];
  constructor(private gapi: GoogleAPIService) {
    // gapi.request(new URL('https://www.googleapis.com/books/v1/volumes?q=Alice'), {}).then(console.log).catch(console.error);
    gapi.searchBooks("Alice").then(resp => {
      this.books = resp.items;
      for (const book of this.books) {
        gapi.retrieveHighResThumbnails(book);
      }
    });
    // const req = new SearchRequest('Alice');
    // req.query.inauthor = 'Alice';
    // req.maxResults = 30;
    // gapi.searchBooks(req).then(console.log);
  }
}
