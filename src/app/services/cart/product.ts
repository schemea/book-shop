import { Book } from "shared/book";
import { ThumbnailMap } from "shared/thumbnails";


export class Product {
  id: string;
  name: string;
  price?: Price;
  thumbnails: ThumbnailMap;
  quantity = 1;
  description: string;

  constructor() {  }

  static fromBook(book: Book) {
    const product = new Product();
    product.name = book.title;
    product.price = book.price;
    product.thumbnails = book.thumbnails;
    product.id = book.googleID;
    product.description = book.description || book.textSnippet;
    return product;
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
