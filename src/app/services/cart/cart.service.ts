import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class CartService {
  private items: Product[];
  discounts: Discount[];

  constructor() { }

  add(...products: Product[]) {
    this.items.push(...products);
  }
  remove(...products: Product[]) {
    for (const product of products) {
      this.items.splice(this.items.indexOf(product), 1);
    }
  }

  computeOriginalCost() {
    let total = 0;
    for (const product of this.items) {
      total += product.price.amount;
    }
    return total;
  }
  computeDiscountedCost() {
    let total = 0;
    for (const product of this.items) {
      const price = product.computeDiscountPrice(this.discounts);
      total += price.amount;
    }
    return total;
  }
}
