import { Component, OnInit, Input, HostBinding, ViewEncapsulation } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";
import { SearchResponse, SearchRequest } from "app/services/google-api/listing";

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.scss"],
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
    if (this.thumbnailSize !== "thumbnail" && this.thumbnailSize !== "smallThumbnail") {
      this.gapi.retrieveHighResThumbnails(this.book);
    }
  }

  getStars() {
    const arr: string[] = [];
    let i = 0;
    for (; i < this.book.rating; ++i) {
      arr.push("star");
    }
    for (; i < 5; ++i) {
      arr.push("star_border");
    }
    return arr;
  }

  getDescription() {
    if (this.book.textSnippet) {
      const desc = this.book.textSnippet.replace(/<br\s*\/?>/gi, "");
      return desc;
    } else {
      return this.book.description;
    }
  }
}
