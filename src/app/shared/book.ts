export class Book {
  title: string;
  price: string;
  authors: string[];
  publisher: string;
  pagesCount: number;
  description: string;
  identifiers = new Map<string, string>();
  rating: number;

  imageLinks: {
    smallThumbnail: string,
    thumbnail: string
  };

  language: 'fr' | 'en';
}
