import { TestBed } from '@angular/core/testing';

import { ConversionApiService } from './conversion-api.service';

describe('ConversionApiService', () => {
  let service: ConversionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
