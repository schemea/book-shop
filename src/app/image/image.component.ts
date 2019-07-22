import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TweenLite, Power2 } from "gsap";
import { fadeNoTransform } from "shared/animations";

@Component({
  selector: "app-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeNoTransform
  ]
})
export class ImageComponent implements OnInit, OnChanges {
  @Input() src: string;
  @Input() alt: string;
  @Input() draggable = false;
  currentImage: HTMLImageElement;
  loading: boolean;
  available = false;
  loadingCount = 0;

  constructor(private ref: ElementRef<HTMLElement>, private http: HttpClient) {
    let loading = false;
    Object.defineProperty(this, "loading", {
      get: () => loading,
      set: (value: boolean) => {
        if (value !== loading) {
          if (value) {
            ++this.loadingCount;
          }
          loading = value;
        }
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.

    if (changes.src) {
      // this.currentImage = changes.src.currentValue;
      const img = this.ref.nativeElement.appendChild(document.createElement("img"));
      img.style.display = "none";
      img.src = changes.src.currentValue;
      img.alt = this.alt;
      img.draggable = this.draggable;
      this.loading = true;
      img.onload = () => {
        img.style.display = "";
        const prev = this.currentImage;
        this.currentImage = img;
        this.currentImage.classList.add("current");
        if (prev) {
          prev.classList.value = "old";
          TweenLite.to(prev, 0.3 * 1.5, {
            width: prev.width + (this.currentImage.width - prev.width) * 2,
            height: prev.height + (this.currentImage.height - prev.height) * 2,
            opacity: 0,
            ease: Power2.easeOut,
            onComplete: () => prev.remove()
          });
          TweenLite.from(this.currentImage, 0.3, {
            width: prev.width,
            height: prev.height
          });
        } else {
          this.currentImage.classList.add("first");
        }

        img.onerror = () => {
          this.loading = false;
        };
        this.loading = false;
        this.available = true;
      };
    }

    if (changes.draggable) {
      this.currentImage.draggable = changes.draggable.currentValue;
    }

  }

}
