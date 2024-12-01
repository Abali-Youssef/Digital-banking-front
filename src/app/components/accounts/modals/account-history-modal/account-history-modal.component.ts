import { Component, Inject } from '@angular/core';
import { BankAccountService } from '../../../../services/bankAccount/bank-account-service.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BankOperationService } from '../../../../services/bank-operation/bank-operation.service';
import { AccountHistory, BankAccountOperation } from '../../../../services/models/bankAccountOperation';

@Component({
  selector: 'app-account-history-modal',
  templateUrl: './account-history-modal.component.html',
  styleUrl: './account-history-modal.component.css'
})
export class AccountHistoryModalComponent {
  operations!: BankAccountOperation[];
  displayedColumns: string[] = ['type', 'amount', 'date', 'description'];
  loading: boolean = true;

  constructor(
    private operationService: BankOperationService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AccountHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject bank account details
  ) { }

  ngOnInit(): void {
    this.fetchOperations();
  }

  fetchOperations(): void {

    this.operationService.getAccountHistory(this.data.id).subscribe(
      (response) => {
        this.operations = response.bankAccountOperations;
        this.loading = false;
      },
      (error) => {
        this.toastr.error('Failed to fetch operations. Please try again.');
        this.loading = false;
      }
    );
  }
}
