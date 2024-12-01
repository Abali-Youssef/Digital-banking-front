import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BankAccountService } from '../../../../services/bankAccount/bank-account-service.service';

@Component({
  selector: 'app-account-operation-modal',
  templateUrl: './account-operation-modal.component.html',
  styleUrl: './account-operation-modal.component.css'
})
export class AccountOperationModalComponent {
  operationForm!: FormGroup;
  isTransferOperation: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccountOperationModalComponent>,
    private toastr: ToastrService,
    private bankAccountService: BankAccountService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.operationForm = this.fb.group({
      operationType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required,]],
      destinationAccountId: [''] // Validator is added dynamically for transfer
    });
  }

  onOperationTypeChange(type: string): void {
    this.isTransferOperation = type === 'TRANSFER';

    if (this.isTransferOperation) {
      this.operationForm.get('destinationAccountId')?.setValidators([Validators.required]);
    } else {
      this.operationForm.get('destinationAccountId')?.clearValidators();
    }

    this.operationForm.get('destinationAccountId')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.operationForm.valid) {
      const formValue = this.operationForm.value;

      const operationData: any = {
        operationType: formValue.operationType,
        amount: formValue.amount,
        description: formValue.description,

      };
      let destinationAccountId: string = this.isTransferOperation ? formValue.destinationAccountId : null

      this.bankAccountService.performOperation(this.data.id, destinationAccountId?.toLowerCase(), operationData).subscribe(
        (response) => {
          this.toastr.success('Operation performed successfully.');
          this.dialogRef.close();
        },
        (error) => {
          if (error.error?.exception) this.toastr.error(error.error?.exception);
          if (error.error?.errors?.amount) this.toastr.error(error.error?.errors?.amount);
          if (error.error?.errors?.description) this.toastr.error(error.error?.errors?.description);
          if (error.error?.errors?.sourceAccountId) this.toastr.error(error.error?.errors?.sourceAccountId);
          if (error.error?.errors?.destinationAccountId) this.toastr.error(error.error?.errors?.destinationAccountId);
          if (error.error?.error) this.toastr.error("Something went wrong! please try again");
        }
      );
    } else {
      this.toastr.error('Please fix the errors in the form.');
      this.operationForm.markAllAsTouched();
    }
  }
}
