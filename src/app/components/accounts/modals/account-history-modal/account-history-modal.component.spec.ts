import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHistoryModalComponent } from './account-history-modal.component';

describe('AccountHistoryModalComponent', () => {
  let component: AccountHistoryModalComponent;
  let fixture: ComponentFixture<AccountHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountHistoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
