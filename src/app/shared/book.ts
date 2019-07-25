import { ThumbnailMap } from "./thumbnails";

export class Book implements Book {

  constructor(volume: GoogleAPI.VolumeResource) {
    this.assign(volume);
  }
  title: string;
  googleID: string;
  selfLink: string;
  saleability: GoogleAPI.Saleability;
  price?: GoogleAPI.Price;
  authors?: string[];
  publisher: string;
  pageCount: number;
  description?: string;
  identifiers: {[k: string]: string} = {};
  rating?: number;
  textSnippet?: string;
  genre: string[];

  thumbnails: ThumbnailMap;

  language: "fr" | "en";

  static unserialize(obj: any): Book {
    const book: Book = Object.assign(Object.create(Book.prototype), obj);
    book.thumbnails = Object.assign(Object.create(ThumbnailMap.prototype), book.thumbnails as any);
    return book;
  }

  assign(volume: GoogleAPI.VolumeResource) {

    const volumeInfo = volume.volumeInfo;
    Object.assign(this, {
      googleID: volume.id,
      selfLink: volume.selfLink,
      authors: volumeInfo.authors,
      title: volumeInfo.title,
      description: volumeInfo.description,
      thumbnails: new ThumbnailMap(volumeInfo.imageLinks),
      rating: volumeInfo.averageRating,
      pageCount: volumeInfo.pageCount,
      language: volumeInfo.language,
      price: volume.saleInfo.retailPrice,
      saleability: volume.saleInfo.saleability,
      textSnippet: volume.searchInfo && volume.searchInfo.textSnippet,
      genre: volumeInfo.categories,
      publisher: volumeInfo.publisher
    } as Book);
    if (volumeInfo.industryIdentifiers) {
      for (const id of volumeInfo.industryIdentifiers) {
        this.identifiers[id.type] = id.identifier;
      }
    }
  }

  // pickThumbnail(size: keyof Book["thumbnails"] = "extraLarge") {
  //   if (!this.thumbnails) {
  //     return "";
  //   }

  //   const sizes: typeof size[] = ["extraLarge", "large", "medium", "small", "thumbnail", "smallThumbnail"];
  //   let sizeFound = false;
  //   for (const key of sizes) {
  //     if (key === size || sizeFound) {
  //       const value = this.imageLinks[key];
  //       if (value) {
  //         return value;
  //       }
  //       sizeFound = true;
  //     }
  //   }

  //   return "";
  // }
}
