interface Book {
  title: string;
  price: string;
  authors: string[];
  publisher: string;
  pageCount: number;
  description?: string;
  identifiers: Map<string, string>;
  rating?: number;

  imageLinks: {
    smallThumbnail: string,
    thumbnail: string
  };

  language: 'fr' | 'en';
}

interface Discount {
  name: string;
  uuid: string;
  apply: (value: number) => number;
}
