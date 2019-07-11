import { TestBed } from '@angular/core/testing';

import { GoogleAPIService } from './google-api.service';

describe('GoogleAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleAPIService = TestBed.get(GoogleAPIService);
    expect(service).toBeTruthy();
  });
});
