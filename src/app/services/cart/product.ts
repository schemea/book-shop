import { Book } from "shared/book";
import { ThumbnailMap } from "shared/thumbnails";


export class Product {
  id: string;
  name: string;
  price: Price;
  thumbnails: ThumbnailMap;
  quantity = 1;
  description: string;

  constructor(obj?: Book) {
    if (obj instanceof Book) {
      this.initializeFromBook(obj);
    }
  }

  initializeFromBook(book: Book) {
    this.name = book.title;
    this.price = book.price;
    this.thumbnails = book.thumbnails;
    this.id = book.googleID;
    this.description = book.description || book.textSnippet;
  }

  computeDiscountedPrice(discounts: Discount[]) {
    let price = Object.assign({}, this.price);
    for (const discount of discounts) {
      if (discount.target === "product" && discount.validFor(this)) {
        price = discount.discountedPrice(price);
      }
    }
    return price;
  }
}
