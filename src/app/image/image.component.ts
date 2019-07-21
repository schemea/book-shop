import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ImageComponent implements OnInit, OnChanges {
  @Input() src: string;
  @Input() alt: string;
  currentImage: string;

  constructor(private ref: ElementRef<HTMLElement>, private http: HttpClient) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.

    if (changes.src) {
      this.currentImage = changes.src.currentValue;
    }
  }

}
