import { Observable, Subscriber, Subscription } from "rxjs";
import { Book } from "shared/book";
import { SearchRequest, SearchResponse } from "./listing";
import { toArray, map } from "rxjs/operators";
type GoogleAPIService = import(".").GoogleAPIService;

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
  public get totalItems() { return this.data.totalItems; }
  public get request() { return this.data.request; }
  public get aborted() { return this.state === State.unintialized; }
  public get paused() { return this.state === State.paused; }
  public get running() { return this.state === State.running; }
  public get done() { return this.state === State.done; }

  constructor(private gapi: GoogleAPIService) {
    super((subscriber) => {
      this.subscriber = subscriber;
    });
  }

  start(request: SearchRequest) {
    this.data.request = request;
    this.data.next = request.clone();
    this.state = State.paused;
    this.resume();
  }

  resume() {
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
    if (this.request.filter(volume)) {
      const book = new Book(volume);
      this.subscriber.next(book);
      ++this.data.emittedCount;
      if (this.data.emittedCount === this.request.maxResults) {
        this.state = State.done;
        this.subscriber.complete();
      }
    }
  }

  private process(volumeList: GoogleAPI.VolumesList) {
    const request = this.data.next;
    for (const item of volumeList.items) {
      if (this.running) {
        this.emit(item);
      } else if (this.paused) {
        this.data.queue.push(item);
      } else {
        break;
      }
    }
    request.startIndex += volumeList.items.length;
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
