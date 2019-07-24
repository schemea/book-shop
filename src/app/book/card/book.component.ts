import { Component, OnInit, Input, ViewChild, ElementRef, AfterContentInit, SecurityContext } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { Book } from "shared/book";
import M from "materialize-css";
import { fadeScale } from "shared/animations";
import { BookDetailsComponent } from "app/book/details";
import { CartService } from "app/services/cart";
import { Product } from "app/services/cart/product";

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.scss"],
  providers: [
    GoogleAPIService
  ],
  animations: [
    fadeScale
  ]
})
export class BookComponent implements OnInit, AfterContentInit {
  @Input() book: Book;
  @Input() thumbnailSize: keyof GoogleAPI.ThumbnailMap;
  @ViewChild("details", null) details: BookDetailsComponent;
  @ViewChild("card", null) card: ElementRef<HTMLDivElement>;
  modal: M.Modal;

  constructor(private ref: ElementRef<HTMLElement>, private gapi: GoogleAPIService, private cart: CartService) {
    if (!this.thumbnailSize) {
      this.thumbnailSize = "thumbnail";
    }
  }

  ngOnInit() {
    if (this.thumbnailSize !== "thumbnail" && this.thumbnailSize !== "smallThumbnail") {
      this.gapi.retrieveHighResThumbnails(this.book);
    }
  }

  addCart(event: MouseEvent) {
    event.stopPropagation();
    this.cart.add(Product.fromBook(this.book));
  }

  ngAfterContentInit(): void {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.

    let modals: NodeListOf<HTMLElement>;

    this.modal = M.Modal.init(this.details.ref.nativeElement.parentElement, {
      inDuration: 400,
      outDuration: 300,
      preventScrolling: false,
      onCloseStart: () => {
        (modals || (modals = this.ref.nativeElement.querySelectorAll<HTMLElement>(".modal, .modal-overlay")))
          .forEach(el => el.style.pointerEvents = "none");
      },
      onOpenStart: () => {
        if (modals) {
          modals.forEach(el => el.style.pointerEvents = "unset");
        }
      }
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
    if (this.gapi.retrieveHighResThumbnails(this.book)) {
      this.details.image.loading = true;
    }
    this.modal.open();
  }
}
