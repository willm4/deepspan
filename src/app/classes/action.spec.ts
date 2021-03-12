import { TestBed } from '@angular/core/testing';

import { Action } from './action';

describe('ActionService', () => {
  let service: Action;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Action);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
