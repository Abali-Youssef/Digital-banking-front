import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer-service/customer.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Customer, PaginatedCustomerResponse } from '../../services/models/customer';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerModalComponent } from './modals/add-customer-modal/add-customer-modal.component';
import Swal from 'sweetalert2'
import { EditCustomerModalComponent } from './modals/edit-customer-modal/edit-customer-modal.component';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/auth/login.service';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers!: Array<Customer>;
  currentPage: number = 1;
  totalPage!: number;
  totalElements!: number;
  pageSize!: number;
  errorMessage!: string;
  searchFormGroup!: FormGroup;
  selectAll: boolean = false;
  selectedRowsId: Array<number> = [];
  constructor(public auth: LoginService, private toastr: ToastrService, private customerService: CustomerService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    })
    this.handleSearchCustomers(this.currentPage);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerModalComponent, {
      width: '400px',  // Set the width of the modal
      disableClose: true,
    });

    // Optional: You can subscribe to the afterClosed() event
    dialogRef.afterClosed().subscribe(result => {
      this.handleSearchCustomers(this.currentPage)
    });
  }
  onEditCustomer(customer: Customer): void {
    const dialogRef = this.dialog.open(EditCustomerModalComponent, {
      width: '400px',
      data: customer, // Pass the customer object to the modal
    });
    dialogRef.afterClosed().subscribe(result => {
      this.handleSearchCustomers(this.currentPage)
    });
  }

  handleSearchCustomers(page: number) {
    let kw = this.searchFormGroup.value.keyword;
    this.customers = [];
    this.customerService.searchCustomers(kw, page).subscribe({
      next: (response) => {
        this.customers = response.customers;
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

    // this.customers = this.customerService.searchCustomers(kw).pipe(
    //   catchError(err => {
    //     this.errorMessage = err.message;
    //     console.log("error: " + this.errorMessage);
    //     return throwError(err);
    //   })
    // )
  }
  handleDeleteCustomer(c: Customer) {
    this.selectedRowsId = [c.id];
    Swal.fire({
      title: "Delete",
      text: "Do you want to delete this customer?",

      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(this.selectedRowsId).subscribe({
          next: (resp) => {
            this.toastr.success("Deleted successfully");
            this.handleSearchCustomers(1);
          },
          error: err => {
            this.errorMessage = err.message;
            if (err.error?.exception) this.toastr.error(err.error?.exception);
            if (err.error?.error) this.toastr.error("Something went wrong! please try again");

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
      this.selectedRowsId = this.customers.map(cust => cust.id);
    } else {
      this.selectedRowsId = [];
    }
  }
  handleSelectRow(id: number): void {
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
  multipleDeleteCustomers() {
    if (this.selectedRowsId.length == 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a customer to delete",
      });
    } else {
      Swal.fire({
        title: "Delete",
        text: "Do you want to delete those customers?",

        showCancelButton: true,
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          this.customerService.deleteCustomer(this.selectedRowsId).subscribe({
            next: (resp) => {
              this.handleSearchCustomers(1);
              this.toastr.success("Deleted successfully");
            },
            error: err => {
              this.errorMessage = err.message;
              if (err.error?.exception) this.toastr.error(err.error?.exception);
              if (err.error?.error) this.toastr.error("Something went wrong! please try again");


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
      this.handleSearchCustomers(this.currentPage)
    }
  }
  nextPage() {
    if (this.currentPage + 1 <= this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.handleSearchCustomers(this.currentPage)
    }
  }

}
