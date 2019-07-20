import { Component, OnInit, ElementRef, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { GoogleAPIService } from "app/services/google-api";


class SearchEvent extends Event {
  constructor(public keywords: string) {
    super("search");
  }
}
@Component({
  selector: "app-search-input",
  templateUrl: "./search-input.component.html",
  styleUrls: ["./search-input.component.scss"]
})
export class SearchInputComponent implements OnInit {
  @ViewChild("input", null) input: ElementRef<HTMLInputElement>;
  @Input() label: string;
  @Output() search = new EventEmitter<SearchEvent>();

  instance: M.Autocomplete;

  constructor(private gapi: GoogleAPIService) { }

  ngOnInit() {
    this.instance = M.Autocomplete.init(this.input.nativeElement, {
      onAutocomplete: this.onSearch.bind(this)
    });
  }

  onChange(event: Event) {
    this.gapi.fetchAutocompletion(this.input.nativeElement.value).subscribe(data => {
      this.instance.updateData(data);
      (this.instance as any).open();
      this.input.nativeElement.dispatchEvent(new Event("change"));
    });
  }

  onSearch() {
    this.search.emit(new SearchEvent(this.input.nativeElement.value));
  }
}
