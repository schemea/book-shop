import { Component, OnInit, ElementRef, Input, ViewChild } from "@angular/core";
import { GoogleAPIService } from "app/services/google-api";

@Component({
  selector: "app-search-input",
  templateUrl: "./search-input.component.html",
  styleUrls: ["./search-input.component.scss"]
})
export class SearchInputComponent implements OnInit {
  data: {[k: string]: string};
  @ViewChild("input", null) input: ElementRef<HTMLInputElement>;
  @Input() label: string;
  instance: M.Autocomplete;

  constructor(private gapi: GoogleAPIService) { }

  ngOnInit() {
    this.instance = M.Autocomplete.init(this.input.nativeElement);
  }

  onChange(event: Event) {
    this.gapi.fetchAutocompletion(this.input.nativeElement.value).subscribe(obj => {
      Object.assign(this.data, obj);
      this.instance.updateData(this.data);
    });
  }
}
