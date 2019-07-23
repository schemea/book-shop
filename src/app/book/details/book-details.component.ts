import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { Book } from "shared/book";
import { ImageComponent } from "app/image/image.component";

@Component({
  selector: "app-book-details",
  templateUrl: "./book-details.component.html",
  styleUrls: ["./book-details.component.scss"]
})
export class BookDetailsComponent implements OnInit {
  @Input() book: Book;
  @ViewChild("image", {
    read: ImageComponent,
    static: false
  }) image: ImageComponent;

  constructor(public ref: ElementRef<HTMLElement>) { }

  ngOnInit() {

  }

}
