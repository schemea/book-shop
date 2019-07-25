import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { BookComponent } from "./components/book/card";
import { FormsModule} from "@angular/forms";
import { ImageComponent } from "./components/image/image.component";
import { SearchInputComponent } from "./components/search-input/search-input.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoadingOverlayComponent } from "./components/loading-overlay/loading-overlay.component";
import { BookCollectionComponent } from "./components/book/collection/book-collection.component";
import { BookDetailsComponent } from "./components/book/details/book-details.component";
import { SearchComponent } from "./routing/search/search.component";
import { DetailsComponent } from "./routing/details/details.component";
import { CartComponent } from "./routing/cart/cart.component";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { HeaderComponent } from "./header/header.component";
import { ProductComponent } from "./components/product/product.component";

@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    ImageComponent,
    SearchInputComponent,
    LoadingOverlayComponent,
    BookCollectionComponent,
    BookDetailsComponent,
    SearchComponent,
    DetailsComponent,
    CartComponent,
    PaginationComponent,
    HeaderComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
