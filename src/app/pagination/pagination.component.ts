import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

interface Page {
  index: number;
  active: boolean;
}

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"]
})
export class PaginationComponent implements OnInit {
  @Input() max: number;
  @Input() min: number;

  // tslint:disable-next-line: variable-name
  private active_: number;
  set active(value: number) {
    this.active_ = value;
    this.activeEmitter.emit(this.active_);
  }
  @Input() get active() { return this.active_; }

  // tslint:disable-next-line: no-output-rename
  @Output("active") @Output("pageChange") activeEmitter = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  onClick(event: Event, page: Page) {
    event.preventDefault();
    this.active = page.index;
  }

  getPages() {
    const pages: Page[] = [];
    for (let i = this.min; i <= this.max; ++i) {
      pages.push({
        index: i,
        active: this.active === i
      });
    }
    return pages;
  }
}
