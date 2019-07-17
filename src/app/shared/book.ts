
export class Book implements Book {
  title: string;
  googleID: string;
  selfLink: string;
  saleability: GoogleAPI.Saleability;
  price: GoogleAPI.Price;
  authors: string[];
  publisher: string;
  pageCount: number;
  description?: string;
  identifiers: Map<string, string> = new Map();
  rating?: number;

  imageLinks: GoogleAPI.ThumbnailMap;

  language: "fr" | "en";

  constructor(volume: GoogleAPI.VolumeResource) {
    this.assign(volume);
  }

  assign(volume: GoogleAPI.VolumeResource) {

    const volumeInfo = volume.volumeInfo;
    Object.assign(this, {
      googleID: volume.id,
      selfLink: volume.selfLink,
      authors: volumeInfo.authors,
      title: volumeInfo.title,
      description: volumeInfo.description,
      imageLinks: volumeInfo.imageLinks,
      rating: volumeInfo.ratingsCount,
      pageCount: volumeInfo.pageCount,
      language: volumeInfo.language,
      price: volume.saleInfo.retailPrice,
      saleability: volume.saleInfo.saleability
    } as Book);
    if (volumeInfo.industryIdentifiers) {
      for (const id of volumeInfo.industryIdentifiers) {
        this.identifiers.set(id.type, id.identifier);
      }
    }
  }

  pickThumbnail(size: keyof Book["imageLinks"] = "extraLarge") {
    if (!this.imageLinks) {
      return "";
    }

    const sizes: typeof size[] = ["extraLarge", "large", "medium", "small", "thumbnail", "smallThumbnail"];
    let sizeFound = false;
    for (const key of sizes) {
      if (key === size || sizeFound) {
        const value = this.imageLinks[key];
        if (value) {
          return value;
        }
        sizeFound = true;
      }
    }

    return "";
  }
}
