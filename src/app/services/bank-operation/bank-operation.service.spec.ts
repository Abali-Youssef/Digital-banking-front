import { TestBed } from '@angular/core/testing';

import { BankOperationService } from './bank-operation.service';

describe('BankOperationService', () => {
  let service: BankOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
