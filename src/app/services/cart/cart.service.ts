import { Injectable } from "@angular/core";
import { Observable, PartialObserver, Subscriber } from "rxjs";
import { LaunchDiscount } from "./discouts";
import { Product } from "./product";

type ProductID = string | { id: string };

function getProductID(product: ProductID): string {
  if (typeof product === "string") {
    return product;
  } else {
    return product.id;
  }
}

@Injectable({
  providedIn: "root"
})
export class CartService {
  items: Map<string, Product>;
  discounts: Discount[] = [];
  private observable: Observable<void>;
  private emitter: Subscriber<void>;

  constructor() {
    const savedItems: ([string, Product])[] = JSON.parse(localStorage.getItem("cart"));
    if (savedItems) {
      this.items = new Map(savedItems.map(([id, data]) => [data.id, Object.assign(Object.create(Product.prototype), data)]));
    } else {
      this.items = new Map();
    }
    this.observable = new Observable(subscriber => {
      this.emitter = subscriber;
    });

    this.discounts.push(LaunchDiscount);

    this.subscribe({
      next: () => {
        localStorage.setItem("cart", JSON.stringify([...this.items]));
      }
    });
  }

  get(product: ProductID) {
    return this.items.get(getProductID(product));
  }

  add(...products: Product[]) {
    products.forEach(product => {
      const inCart = this.items.get(product.id);
      if (inCart) {
        inCart.quantity += product.quantity;
      } else {
        this.items.set(product.id, product);
      }
    });
    this.emitter.next();
  }
  remove(...products: (({ id: string, quantity: number } & { [k: string]: any }) | string)[]) {
    for (const toRemove of products) {
      const current = this.items.get(getProductID(toRemove));
      current.quantity -= (toRemove as Product).quantity || 1;
      if (current.quantity <= 0) {
        this.items.delete(current.id);
      }
    }
    this.emitter.next();
  }

  clear() {
    this.items.clear();
    this.emitter.next();
  }

  computeOriginalCost() {
    let total = 0;
    this.items.forEach(product => {
      if (product.price) {
        total += product.price.amount;
      }
    });
    return total;
  }
  computeDiscountedCost() {
    let total = 0;
    this.items.forEach(product => {
      if (product.price) {
        const price = product.computeDiscountedPrice(this.discounts);
        total += price.amount;
      }
    });
    return Math.round(total * 100) / 100;
  }

  subscribe(observer: PartialObserver<void>) {
    this.observable.subscribe(observer);
  }
}
