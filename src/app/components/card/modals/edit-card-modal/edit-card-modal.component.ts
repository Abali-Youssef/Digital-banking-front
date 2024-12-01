import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardService } from '../../../../services/card-service/card-service.service';
import { Card } from '../../../../services/models/card';
import { debounceTime } from 'rxjs';
import { BankAccountService } from '../../../../services/bankAccount/bank-account-service.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-card-modal',
  templateUrl: './edit-card-modal.component.html',
  styleUrls: ['./edit-card-modal.component.scss']
})
export class EditCardModalComponent implements OnInit {
  cardForm: FormGroup;
  accounts: any[] = []; // Replace with the actual account model if available

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private bankService: BankAccountService,
    private toastr: ToastrService,


    private dialogRef: MatDialogRef<EditCardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Card
  ) {
    this.cardForm = this.fb.group({
      expirationDate: [null, Validators.required],
      type: [null, Validators.required],
      clientCin: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Populate the form with the existing card data
    this.bankService.getAccount(this.data.accountId).subscribe(
      (response) => {
        this.cardForm.patchValue({
          expirationDate: this.data.expirationDate,
          type: this.data.type,
          clientCin: response // Assuming accountId is tied to CIN
        });
      },
      (error) => {
        if (error.error?.exception) this.toastr.error(error.error?.exception);
        if (error.error?.error) this.toastr.error("Something went wrong! please try again");
      }
    );

  }

  onSearchClient(): void {
    debounceTime(500);
    const cin = this.cardForm.get('clientCin')?.value;
    if (!cin) {
      return;
    }
    this.accounts = []; // Clear previous clients

    this.bankService.getAccountByCustomerId(cin).subscribe(
      (response) => {
        this.accounts = response; // Assuming response is an array of clients

        if (this.accounts.length === 0) {
          this.toastr.warning('No clients found for the entered CIN.');
        }
      },
      (error) => {
        if (error.error?.exception) this.toastr.error(error.error?.exception);
        if (error.error?.error) this.toastr.error("Something went wrong! please try again");
      }
    );
  }

  displayClientName(account: any): string {
    return account ? account.id : '';
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      const updatedCard = {
        ...this.data,
        ...this.cardForm.value
      };

      this.cardService.updateCard(updatedCard).subscribe({
        next: () => {
          this.toastr.success('Card updated successfully.');
          this.dialogRef.close();

        },
        error: (error) => {
          if (error.error?.errors?.expirationDate) this.toastr.error(error.error?.errors?.expirationDate);
          if (error.error?.errors?.type) this.toastr.error(error.error?.errors?.type);
          if (error.error?.errors?.accountId) this.toastr.error(error.error?.errors?.accountId);
          if (error.error?.exception) this.toastr.error(error.error?.exception);
          if (error.error?.error) this.toastr.error("Something went wrong! please try again");
        }
      });
    }
  }
}
