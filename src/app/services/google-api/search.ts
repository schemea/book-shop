import { Observable, Subscriber, Subscription, PartialObserver } from "rxjs";
import { Book } from "shared/book";
import { SearchRequest, SearchResponse, Filter } from "./listing";
import { toArray, map } from "rxjs/operators";
type GoogleAPIService = import("./google.service").GoogleAPIService;

export enum State {
  unintialized,
  paused,
  aborted,
  running,
  done
}
export class SearchObservable extends Observable<Book> {
  private subscriber: Subscriber<Book>;
  private state = State.unintialized;
  private data = {
    request: null as SearchRequest,
    queue: [] as GoogleAPI.VolumeResource[],
    next: null as SearchRequest,
    subscription: null as Subscription,
    emittedCount: 0,
    totalItems: null as number
  };
  get totalItems() { return this.data.totalItems; }
  get request() { return this.data.request; }
  get aborted() { return this.state === State.unintialized; }
  get paused() { return this.state === State.paused; }
  get running() { return this.state === State.running; }
  get done() { return this.state === State.done; }
  get queue() { return this.data.queue; }

  constructor(private gapi: GoogleAPIService) {
    super((subscriber) => {
      this.subscriber = subscriber;
    });
  }

  get(request: SearchRequest) {
    this.data.request = request;
    this.data.next = request.clone();
    this.state = State.paused;
  }

  subscribe(...args: any[]): Subscription {
    // tslint:disable-next-line: deprecation
    const subscription = Observable.prototype.subscribe.call(this, ...args);
    this.resume();
    return subscription;
  }

  resume() {
    if (!this.subscriber) {
      throw new Error("cannot start or resume before subscribing");
    }
    if (!this.paused) {
      return;
    }
    this.state = State.running;
    for (const item of this.data.queue) {
      if (!this.running) {
        break;
      }
      this.emit(item);
    }
    this.fetch(this.data.next);
  }

  abort() {
    this.state = State.aborted;
  }

  private emit(volume: GoogleAPI.VolumeResource) {
    if (Filter.apply(this.request.filters, volume)) {
      const book = new Book(volume);
      this.subscriber.next(book);
      ++this.data.emittedCount;
      if (this.data.emittedCount === this.request.maxResults) {
        this.complete();
      }
    }
  }

  private complete() {
    this.state = State.done;
    this.subscriber.complete();
  }

  private process(volumeList: GoogleAPI.VolumesList) {
    const request = this.data.next;
    if (!this.totalItems) {
      this.data.totalItems = volumeList.totalItems;
    }
    let i = 0;
    for (; i < volumeList.items.length; ++i) {
      const item = volumeList.items[i];
      if (this.running) {
        this.emit(item);
      } else {
        this.data.queue.concat(volumeList.items.slice(i));
        break;
      }
    }
    if (this.totalItems === this.data.emittedCount) {
      this.complete();
      return;
    }
    request.startIndex += i;
    this.fetch(request);
  }

  private fetch(request: SearchRequest) {
    if (this.running) {
      this.data.subscription = this.gapi.request(request).subscribe({
        next: this.process.bind(this)
      });
    }
  }

  toPromise() {
    return this.pipe(
      toArray(),
      map(books => {
        const ans: SearchResponse = {
          items: books,
          next: this.data.next,
          startIndex: this.request.startIndex,
          request: this.request,
          totalItems: this.totalItems
        };
        return ans;
      })
    ).toPromise();
  }
}
