import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { BookComponent } from "./book";
import { FormsModule} from "@angular/forms";
import { ImageComponent } from "./image/image.component";
import { SearchInputComponent } from "./search-input/search-input.component";


@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    ImageComponent,
    SearchInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
