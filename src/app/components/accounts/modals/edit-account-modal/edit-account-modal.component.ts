import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BankAccountService } from '../../../../services/bankAccount/bank-account-service.service';

@Component({
  selector: 'app-edit-account-modal',
  templateUrl: './edit-account-modal.component.html',
  styleUrls: ['./edit-account-modal.component.css']
})
export class EditAccountModalComponent implements OnInit {
  bankAccountForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private bankAccountService: BankAccountService,
    private dialogRef: MatDialogRef<EditAccountModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Injecting bank account data
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.prefillForm();
  }

  initializeForm(): void {
    this.bankAccountForm = this.fb.group({
      customerCin: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],

    });
  }

  prefillForm(): void {
    const account = this.data;
    this.bankAccountForm.patchValue({
      customerCin: account.customer.cin + "-" + account.customer.name,
      status: account.status,

    });

    // Handle account type fields
  }



  onSubmit(): void {

    if (this.bankAccountForm.valid) {
      const formValue = this.bankAccountForm.value;



      this.bankAccountService.updateAccount(this.data.id, formValue.status).subscribe(
        () => {
          this.toastr.success('Bank account updated successfully.');
          this.dialogRef.close(true); // Close with success flag
        },
        (error) => {
          if (error.error?.exception) this.toastr.error(error.error?.exception);
          if (error.error?.errors?.status) this.toastr.error(error.error?.errors?.status);
          if (error.error?.error) this.toastr.error("Something went wrong! please try again");
        }
      );
    } else {
      this.toastr.error('Please fix the errors in the form.');
      this.bankAccountForm.markAllAsTouched();
    }
  }
}
