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
  @Input() set active(value: number) {
    if (value !== this.active_) {
      this.active_ = value;
      this.pageChange.emit(this.active_);
    }
  }
  get active() { return this.active_; }

  @Output() pageChange = new EventEmitter<number>();

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
