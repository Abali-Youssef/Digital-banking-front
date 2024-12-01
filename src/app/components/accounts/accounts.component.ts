import { Component } from '@angular/core';
import { AddAccountModalComponent } from './modals/add-account-modal/add-account-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BankAccount } from '../../services/models/bankAccount';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BankAccountService } from '../../services/bankAccount/bank-account-service.service';
import { EditAccountModalComponent } from './modals/edit-account-modal/edit-account-modal.component';
import Swal from 'sweetalert2';
import { AccountHistoryModalComponent } from './modals/account-history-modal/account-history-modal.component';
import { AccountOperationModalComponent } from './modals/account-operation-modal/account-operation-modal.component';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {

  accounts!: Array<BankAccount>;
  currentPage: number = 1;
  totalPage!: number;
  totalElements!: number;
  pageSize!: number;
  errorMessage!: string;
  searchFormGroup!: FormGroup;
  selectAll: boolean = false;
  selectedRowsId: Array<string> = [];
  constructor(public auth: LoginService, private toastr: ToastrService, private bankAccountService: BankAccountService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    })
    this.getAccounts(this.currentPage);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddAccountModalComponent, {
      width: '400px',  // Set the width of the modal
      disableClose: true,
    });

    // Optional: You can subscribe to the afterClosed() event
    dialogRef.afterClosed().subscribe(result => {
      this.getAccounts(this.currentPage)
    });
  }
  onEditAccount(bankAccount: BankAccount): void {

    const dialogRef = this.dialog.open(EditAccountModalComponent, {
      width: '400px',
      data: bankAccount, // Pass the 
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAccounts(this.currentPage)
    });
  }
  accountOperation(bankAccount: BankAccount): void {

    const dialogRef = this.dialog.open(AccountOperationModalComponent, {
      width: '400px',
      data: bankAccount, // Pass the 
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAccounts(this.currentPage)
    });
  }
  onViewAccount(bankAccount: BankAccount): void {

    const dialogRef = this.dialog.open(AccountHistoryModalComponent, {
      width: '700px',
      data: bankAccount, // Pass the 
    });

  }


  getAccounts(page: number) {
    let kw = this.searchFormGroup.value.keyword;
    this.accounts = [];
    this.bankAccountService.getAccounts(kw, page).subscribe({
      next: (response) => {
        this.accounts = response.bankAccounts;
        this.currentPage = response.currentPage;
        this.pageSize = response.pageSize;
        this.totalPage = response.totalPage;
        this.totalElements = response.totalElements;
      },
      error: (err) => {
        this.errorMessage = err.message;
        if (err.error?.exception) this.toastr.error(err.error?.exception);
        if (err.error?.error) this.toastr.error("Something went wrong! please try again");

      }
    });


  }
  handleDeleteAccount(bk: BankAccount) {
    this.selectedRowsId = [bk.id];
    Swal.fire({
      title: "Delete",
      text: "Do you want to delete this bank Account ?",

      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        this.bankAccountService.DeleteBankAccount(this.selectedRowsId).subscribe({
          next: (resp) => {
            this.getAccounts(1);
            this.toastr.success("Deleted successfully");
          },
          error: (err) => {

            this.errorMessage = err.message;
            if (err.error?.exception) this.toastr.error(err.error?.exception);

          }
        })

      } else {
        this.selectedRowsId = [];
        if (this.selectAll) this.selectAll = !this.selectAll;
      }
    });
  }
  handleSelectAllRows() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedRowsId = this.accounts.map(c => c.id);
    } else {
      this.selectedRowsId = [];
    }
  }
  handleSelectRow(id: string): void {
    if (!this.selectedRowsId.includes(id)) {
      this.selectedRowsId.push(id);
    } else {
      this.selectedRowsId = this.selectedRowsId.filter(listId => id != listId);
    }
    if (this.selectedRowsId.length == this.pageSize) {
      this.selectAll = true
    } else {
      this.selectAll = false
    }
  }
  multipleDeleteAccounts() {
    if (this.selectedRowsId.length == 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a bank account to delete",
      });
    } else {
      Swal.fire({
        title: "Delete",
        text: "Do you want to delete those bank accounts?",

        showCancelButton: true,
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          this.bankAccountService.DeleteBankAccount(this.selectedRowsId).subscribe({
            next: (resp) => {
              this.getAccounts(1);
              this.toastr.success("Deleted successfully");
            },
            error: (err) => {

              this.errorMessage = err.message;
              if (err.error?.exception) this.toastr.error(err.error?.exception);

            }
          })

        } else {
          this.selectedRowsId = [];
          if (this.selectAll) this.selectAll = !this.selectAll;

        }
      });
    }

  }
  PreviousPage() {
    console.log(this.currentPage);
    if (this.currentPage - 1 >= 1) {
      this.currentPage = this.currentPage - 1;
      this.getAccounts(this.currentPage);
    }
  }
  nextPage() {
    if (this.currentPage + 1 <= this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.getAccounts(this.currentPage);
    }
  }

}
