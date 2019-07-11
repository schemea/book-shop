import { Component } from '@angular/core';
import { GoogleAPIService, SearchRequest } from './services/google-api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [
    GoogleAPIService
  ]
})
export class AppComponent {
  title = 'book-shop';
  constructor(private gapi: GoogleAPIService) {
    gapi.searchBooks(new SearchRequest('Alice', 0, 20)).then(console.log);
  }
}
