import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CardService } from '../../../../services/card-service/card-service.service';
import { CustomerService } from '../../../../services/customer-service/customer.service';
import { Customer } from '../../../../services/models/customer';
import { debounceTime } from 'rxjs';
import { BankAccountService } from '../../../../services/bankAccount/bank-account-service.service';
import { BankAccount } from '../../../../services/models/bankAccount';
import { Card } from '../../../../services/models/card';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrl: './card-modal.component.css'
})
export class CardModalComponent implements OnInit {
  cardForm!: FormGroup;
  accounts: BankAccount[] = []; // Will store fetched client data
  isLoadingClient: boolean = false; // Loading indicator for client search

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private bankService: BankAccountService,
    private dialogRef: MatDialogRef<CardModalComponent>,
  ) { }

  ngOnInit(): void {
    // Initialize the reactive form with validations
    this.cardForm = this.fb.group({
      expirationDate: ['', Validators.required],
      type: ['', Validators.required],
      clientCin: ['', [Validators.required,]],
      //client: ['', Validators.required],
    });
  }
  displayClientName(account: BankAccount): string {
    return account ? account.id : '';
  }

  // Search client by CIN
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
        this.isLoadingClient = false;

        if (this.accounts.length === 0) {
          this.toastr.warning('No clients found for the entered CIN.');
        }
      },
      (error) => {
        if (error.error?.exception) this.toastr.error(error.error?.exception);
        if (error.error?.error) this.toastr.error("Something went wrong! please try again");
        this.isLoadingClient = false;
      }
    );
  }

  // Submit the form and save the card
  onSubmit(): void {

    if (this.cardForm.valid) {
      const cardData = this.cardForm.value;
      let card: Card = { id: "", expirationDate: cardData.expirationDate, accountId: this.cardForm.value.clientCin.id, type: cardData.type }
      console.log(card)
      this.cardService.saveCard(card).subscribe(
        (response) => {
          this.toastr.success('Card saved successfully.');
          this.dialogRef.close();
        },
        (error) => {
          if (error.error?.errors?.expirationDate) this.toastr.error(error.error?.errors?.expirationDate);
          if (error.error?.errors?.type) this.toastr.error(error.error?.errors?.type);
          if (error.error?.errors?.accountId) this.toastr.error(error.error?.errors?.accountId);
          if (error.error?.exception) this.toastr.error(error.error?.exception);
          if (error.error?.error) this.toastr.error("Something went wrong! please try again");
        }
      );
    } else {
      this.toastr.error('Please fix the errors in the form.');
      this.cardForm.markAllAsTouched();
    }
  }
}
