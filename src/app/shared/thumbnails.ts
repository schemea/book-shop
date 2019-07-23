

enum Sizes {
  smallThumbnail = 1,
  thumbnail,
  small,
  medium,
  large,
  extraLarge
}

export class ThumbnailMap {

  constructor(imageLinks: GoogleAPI.ThumbnailMap) {
    for (const k in Sizes) {
      if (imageLinks.hasOwnProperty(k)) {
        this[k] = imageLinks[k];
      }
    }
  }

  static Sizes = Sizes;

  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;

  get(size: Sizes | string, falllback: "bigger" | "smaller" | "exact" | "closest" | "closestSmaller" | "closestBigger") {
    const sizeID = typeof size === "number" ? size : Sizes[size];
    const sizeName = typeof size !== "number" ? size : Sizes[size];
    switch (falllback) {
      case "exact":
        return this[sizeName];
      case "smaller":
        for (let currentSize = Sizes.extraLarge; currentSize !== 0; --currentSize) {
          const value = this[Sizes[currentSize]];
          if (currentSize <= sizeID && value) {
            return value;
          }
        }
        // return this.get(sizeID, "bigger");
        return null;
      case "bigger":
        for (let currentSize = 0; currentSize !== Sizes.extraLarge; ++currentSize) {
          const value = this[Sizes[currentSize]];
          if (currentSize >= sizeID && value) {
            return value;
          }
        }
        // return this.get(size, "smaller");
        return null;
      case "closestBigger":
      case "closest":
        for (let i = 0; i < Math.max(Sizes.extraLarge - i, i); ++i) {
          if (this[Sizes[sizeID + i]]) { return this[Sizes[sizeID + i]]; }
          if (this[Sizes[sizeID - i]]) { return this[Sizes[sizeID - i]]; }
        }
        return null;
      case "closestSmaller":
        for (let i = 0; i < Math.max(Sizes.extraLarge - i, i); ++i) {
          if (this[Sizes[sizeID + i]]) { return this[Sizes[sizeID + i]]; }
          if (this[Sizes[sizeID - i]]) { return this[Sizes[sizeID - i]]; }
        }
        return null;
      default:
        throw new Error("Invalid value for 'fallback'");
    }
  }

  getSmallest() { return this.get(0, "bigger"); }
  getBiggest() { return this.get(0, "smaller"); }
}
