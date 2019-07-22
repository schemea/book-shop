import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef } from "@angular/core";
import { Book } from "shared/book";
import { child } from "shared/animations";

@Component({
  selector: "app-book-collection",
  templateUrl: "./book-collection.component.html",
  styleUrls: ["./book-collection.component.scss"],
  animations: [
    child
  ]
})
export class BookCollectionComponent implements OnInit, OnChanges {
  @Input() books: Book[];
  currentBooks: Book[];
  observer: MutationObserver;

  constructor(private ref: ElementRef<HTMLElement>) {
    this.observer = new MutationObserver(mutations => {
      if (this.ref.nativeElement.childElementCount === 0) {
        this.currentBooks = this.books;
        this.stopObserving();
      }
    });
  }

  private observeDOM() {
    this.observer.observe(this.ref.nativeElement, {
      childList: true
    });
  }

  private stopObserving() {
    this.observer.disconnect();
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.

    if (changes.books) {
      if (this.currentBooks && this.currentBooks.length > 0 && changes.books.currentValue.length > 0) {
        this.currentBooks = [];
        this.observeDOM();
      } else {
        this.currentBooks = changes.books.currentValue;
      }
    }
  }

}
