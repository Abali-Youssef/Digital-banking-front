import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOperationModalComponent } from './account-operation-modal.component';

describe('AccountOperationModalComponent', () => {
  let component: AccountOperationModalComponent;
  let fixture: ComponentFixture<AccountOperationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountOperationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountOperationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
