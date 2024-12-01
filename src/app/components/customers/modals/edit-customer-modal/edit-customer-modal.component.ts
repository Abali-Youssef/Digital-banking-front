import { Component, Inject, OnInit } from '@angular/core';
import { Customer } from '../../../../services/models/customer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../../services/customer-service/customer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-customer-modal',
  templateUrl: './edit-customer-modal.component.html',
  styleUrl: './edit-customer-modal.component.css'
})
export class EditCustomerModalComponent implements OnInit {
  customerForm!: FormGroup;

  constructor(private toastr: ToastrService, private fb: FormBuilder, private customerService: CustomerService, private dialogRef: MatDialogRef<EditCustomerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer) {
    // Initialize the form with validation

  }
  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: [this.data.name, [Validators.required, Validators.minLength(3)]],
      email: [this.data.email, [Validators.required, Validators.email]],
      cin: [this.data.cin, [Validators.required]],
    });
  }

  // Handle form submission

  onSubmit(): void {
    if (this.customerForm.valid) {
      const updatedCustomer: Customer = {
        ...this.data, // Preserve the original ID
        ...this.customerForm.value, // Merge updated fields
      };
      console.log(updatedCustomer)
      this.customerService.updateCustomer(updatedCustomer).subscribe(
        (response) => {

          this.dialogRef.close(); // Close the modal and pass back the result
          this.toastr.success("Customer updated successfully");
        },
        (error) => {
          if (error.error?.errors?.email) this.toastr.error(error.error?.errors?.email);
          if (error.error?.errors?.name) this.toastr.error(error.error?.errors?.name);
          if (error.error?.errors?.cin) this.toastr.error(error.error?.errors?.cin);
          if (error.error?.exception) this.toastr.error(error.error?.exception);
          if (error.error?.error) this.toastr.error("Something went wrong! please try again");

        }
      );
    } else {
      this.customerForm.markAllAsTouched();
    }
  }
}
