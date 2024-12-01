import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BankAccountService } from '../../../../services/bankAccount/bank-account-service.service';
import { CustomerService } from '../../../../services/customer-service/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../../../services/models/customer';
import { MatDialogRef } from '@angular/material/dialog';
import { BankAccount } from '../../../../services/models/bankAccount';

@Component({
  selector: 'app-bank-account-modal',
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.css']
})
export class AddAccountModalComponent implements OnInit {
  bankAccountForm!: FormGroup;
  customers: Customer[] = [];

  isCurrentAccount: boolean = false;
  isSavingAccount: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bankAccountService: BankAccountService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddAccountModalComponent>
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.bankAccountForm.invalid);

  }

  initializeForm(): void {
    this.bankAccountForm = this.fb.group({
      customerCin: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      balance: ['', [Validators.required, Validators.min(0)]],
      overDraft: [],
      interestRate: [],
    });
  }

  displayCustomerName(customer: Customer): string {
    return customer ? `${customer.name} - ${customer.cin}` : '';
  }

  onSearchCustomer(): void {
    debounceTime(500);
    const cin = this.bankAccountForm.get('customerCin')?.value;

    if (!cin) {
      return;
    }

    this.customerService.getcustomersByCin(cin).subscribe(
      (response: Customer[]) => {
        this.customers = response;

        if (this.customers.length === 0) {

          this.toastr.warning('No customers found for the entered CIN.');
        }
      },
      (err) => {
        if (err.error?.exception) this.toastr.error(err.error?.exception);
      }
    );
  }

  onTypeChange(type: string): void {
    this.isCurrentAccount = type === 'CURRENT_ACCOUNT';
    this.isSavingAccount = type === 'SAVING_ACCOUNT';

    // Clear values of other fields when switching types
    if (this.isCurrentAccount) {
      // Clear interestRate validators and reset value
      this.bankAccountForm.get('interestRate')?.clearValidators();
      this.bankAccountForm.get('interestRate')?.setValue(null);

      // Set validators for overDraft
      this.bankAccountForm.get('overDraft')?.setValidators([Validators.required, Validators.min(0)]);
      this.bankAccountForm.get('overDraft')?.updateValueAndValidity();

    } else if (this.isSavingAccount) {

      // Clear overDraft validators and reset value
      this.bankAccountForm.get('overDraft')?.clearValidators();
      this.bankAccountForm.get('overDraft')?.setValue(null);

      // Set validators for interestRate
      this.bankAccountForm.get('interestRate')?.setValidators([Validators.required, Validators.min(0)]);
      this.bankAccountForm.get('interestRate')?.updateValueAndValidity();
    }

  }

  onSubmit(): void {


    if (this.bankAccountForm.valid) {
      const formValue = this.bankAccountForm.value;

      const bankAccount: any = {
        id: '',
        balance: formValue.balance,
        type: formValue.type,
        status: formValue.status,
        customerId: formValue.customerCin.id,
        overDraft: this.isCurrentAccount ? formValue.overDraft : null,
        interestRate: this.isSavingAccount ? formValue.interestRate : null,
      };


      this.bankAccountService.saveAccount(bankAccount).subscribe(
        (response) => {
          this.toastr.success('Bank account added successfully.');
          this.dialogRef.close();
        },
        (error) => {
          if (error.error?.exception) this.toastr.error(error.error?.exception);
          if (error.error?.errors?.overDraft) this.toastr.error(error.error?.errors?.overDraft);
          if (error.error?.errors?.type) this.toastr.error(error.error?.errors?.type);
          if (error.error?.errors?.customerId) this.toastr.error(error.error?.errors?.customerId);
          if (error.error?.errors?.balance) this.toastr.error(error.error?.errors?.balance);
          if (error.error?.errors?.status) this.toastr.error(error.error?.errors?.status);
          if (error.error?.errors?.interestRate) this.toastr.error(error.error?.errors?.interestRate);
          if (error.error?.error) this.toastr.error("Something went wrong! please try again");
        }
      );
    } else {
      this.toastr.error('Please fix the errors in the form.');
      this.bankAccountForm.markAllAsTouched();
    }
  }
}
