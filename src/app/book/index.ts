import { Component, OnInit, Input } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";
import { SearchResponse, SearchRequest } from "app/services/google-api/listing";

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.less"],
  providers: [
    GoogleAPIService
  ]
})
export class BookComponent implements OnInit {
  @Input() book: Book;
  @Input() thumbnailSize: keyof GoogleAPI.ThumbnailMap;

  constructor(private gapi: GoogleAPIService) {
    if (!this.thumbnailSize) {
      this.thumbnailSize = "small";
    }
  }

  ngOnInit() {

  }
}
