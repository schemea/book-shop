import { Component, OnInit } from "@angular/core";
import { CartService } from "app/services/cart";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit {



  constructor(public cart: CartService) {   }

  removeProduct(id: string) {
    this.cart.remove(id);
  }


  ngOnInit() {
  }

}
