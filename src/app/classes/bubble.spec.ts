import { TestBed } from '@angular/core/testing';

import { Bubble } from './bubble';

describe('Bubble', () => {
  let service: Bubble;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bubble);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
