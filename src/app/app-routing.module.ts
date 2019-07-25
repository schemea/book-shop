import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SearchComponent } from "./routing/search/search.component";
import { DetailsComponent } from "./routing/details/details.component";
import { CartComponent } from "./routing/cart/cart.component";

const routes: Routes = [
  {path: "book/:id", component: DetailsComponent},
  {path: "", component: SearchComponent},
  {path: "cart", component: CartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
