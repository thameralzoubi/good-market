import { TestBed } from '@angular/core/testing';

import { SearchTs } from './search.ts';

describe('SearchTs', () => {
  let service: SearchTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
