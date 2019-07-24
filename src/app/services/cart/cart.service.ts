import { Injectable } from "@angular/core";
import { Observable, PartialObserver, Subscriber } from "rxjs";
import { LaunchDiscount } from "./discouts";
import { Product } from "./product";

type ProductID = string | {id: string};

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
  private items = new Map<string, Product>();
  discounts: Discount[] = [];
  private observable: Observable<void>;
  private emitter: Subscriber<void>;

  constructor() {
    this.observable = new Observable(subscriber => {
      this.emitter = subscriber;
    });

    const prod = new Product();
    prod.description = "descrip";
    prod.id = "dkqljl";
    prod.name = "Alice";
    prod.price = {amount: 10, currencyCode: "EUR"};
    prod.quantity = 1;
    prod.thumbnails = null;
    this.items.set("dkqljl", prod);
    this.discounts.push(LaunchDiscount);
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
      total += product.price.amount;
    });
    return total;
  }
  computeDiscountedCost() {
    let total = 0;
    this.items.forEach(product => {
      const price = product.computeDiscountedPrice(this.discounts);
      total += price.amount;
    });
    return total;
  }

  subscribe(observer: PartialObserver<void>) {
    this.observable.subscribe(observer);
  }
}
