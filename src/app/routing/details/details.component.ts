import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Book } from "shared/book";
import { GoogleAPIService } from "app/services/google-api";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent implements OnInit {
  book: Book;

  constructor(private route: ActivatedRoute, private gapi: GoogleAPIService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gapi.getVolumeByID(params.id).subscribe(book => {
        this.book = book;
      });
    });
  }

}
