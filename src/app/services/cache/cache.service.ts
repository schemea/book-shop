import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subscriber } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CacheService {
  data: { [k: string]: any } = {};

  constructor(private http: HttpClient) {
    const json = localStorage.getItem("cache");
    if (json) {
      this.data = JSON.parse(json);
    }
  }

  get<T>(url: string, options?): Observable<T> {
    if (this.data[url]) {
      return new Observable(subscriber => {
        subscriber.next(this.data[url]);
      });
    } else {
      return this.http.get(url, options).pipe(tap(data => {
        this.data[url] = data;
        localStorage.setItem("cache", JSON.stringify(this.data));
      })) as Observable<T>;
    }
  }

}
