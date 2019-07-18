import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";
import { SearchResponse, SearchRequest } from "app/services/google-api/listing";

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.scss"],
  providers: [
    GoogleAPIService
  ],
  host: {
    class: "card horizontal waves-effect"
  }
})
export class BookComponent implements OnInit {
  @Input() book: Book;
  @Input() thumbnailSize: keyof GoogleAPI.ThumbnailMap;
  // @HostBinding("class.card") card: boolean;
  // @HostBinding("class.horizontal") horizontal: boolean;

  constructor(private gapi: GoogleAPIService) {
    if (!this.thumbnailSize) {
      this.thumbnailSize = "small";
    }
  }

  ngOnInit() {
    if (this.thumbnailSize !== "thumbnail" && this.thumbnailSize !== "smallThumbnail") {
      this.gapi.retrieveHighResThumbnails(this.book);
    }
    // this.card = true;
    // this.horizontal = true;
  }
}
