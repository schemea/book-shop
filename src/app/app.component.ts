import { Component } from "@angular/core";
import { GoogleAPIService } from "services/google-api";
import { child, fade } from "shared/animations";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [
    GoogleAPIService
  ]
})
export class AppComponent {
  title = "book-shop";

}
