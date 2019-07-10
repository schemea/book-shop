class Book {
  title: string;
  price: string;
  authors: string[];
  publisher: string;
  pagesCount: number;

  imageLinks: {
    smallThumbnail: string,
    thumbnail: string
  };

  language: 'fr' | 'en';
}
