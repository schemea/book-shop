import rp from 'request-promise';

const baseURL = 'https://www.googleapis.com/books/v1/';

class GApi {
  async searchBooks(keywords: string): Promise<Book[]> {
    const json = await rp(baseURL + 'volumes?q=' + keywords);
    return JSON.parse(json).items;
  }
}
