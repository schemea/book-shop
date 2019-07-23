import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";

import { GoogleAPIService } from "./index";
import { SearchRequest } from "./listing";

describe("GoogleAPIService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  let service: GoogleAPIService;

  it("should be created", () => {
    service = TestBed.get(GoogleAPIService);
    expect(service).toBeTruthy();
  });

  it("request should return an Object", () => {
    const json = service.request(new SearchRequest("Alice").toString());
    expect(json instanceof Object).toBeTruthy();
  });
});
