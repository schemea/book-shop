import { Component, OnInit } from '@angular/core';
import { CartService } from "app/services/cart";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(private cart:CartService) { 
    
  }

  ngOnInit() {
  }

}
