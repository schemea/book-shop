import { Component, OnInit, ElementRef, Input, ViewChild, Output, EventEmitter, OnDestroy } from "@angular/core";
import { GoogleAPIService } from "app/services/google-api";
import { Subscription } from "rxjs";


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
export class SearchInputComponent implements OnInit, OnDestroy {
  @ViewChild("input", null) input: ElementRef<HTMLInputElement>;
  @Input() label: string;
  @Output() search = new EventEmitter<SearchEvent>();

  subscription: Subscription;
  instance: M.Autocomplete;

  constructor(private gapi: GoogleAPIService) { }

  ngOnInit() {
    this.instance = M.Autocomplete.init(this.input.nativeElement, {
      onAutocomplete: this.onSearch.bind(this)
    });
  }

  onChange() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.gapi.fetchAutocompletion(this.input.nativeElement.value).subscribe(data => {
      this.instance.updateData(data);
      (this.instance as any).open();
      this.subscription.unsubscribe();
      this.subscription = null;
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

    this.subscription.unsubscribe();
    this.subscription = null;
  }

  onEnter(event: Event) {
    if (this.instance.activeIndex < 0) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.onSearch();
    }
  }

  onSearch() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.search.emit(new SearchEvent(this.input.nativeElement.value));
    (this.instance as any).close();
  }
}
