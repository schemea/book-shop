import { Component, OnInit, Input, HostBinding, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";

declare var M: typeof import("materialize-css");

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.scss"],
  providers: [
    GoogleAPIService
  ]
})
export class BookComponent implements OnInit, AfterViewInit {
  @Input() book: Book;
  @Input() thumbnailSize: keyof GoogleAPI.ThumbnailMap;
  @ViewChild("details", null) details: ElementRef<HTMLDivElement>;
  modal: M.Modal;

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

  ngAfterViewInit() {
    this.modal = M.Modal.init(this.details.nativeElement, {
      inDuration: 400,
      outDuration: 300
    });
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

  showDetails() {
    this.gapi.retrieveHighResThumbnails(this.book);
    this.modal.open();
  }
}
