import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../../services/models/customer';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../../services/customer-service/customer.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrl: './add-customer-modal.component.css'
})
export class AddCustomerModalComponent {
  customerForm!: FormGroup;
  hidePassword = true;

  constructor(private dialogRef: MatDialogRef<AddCustomerModalComponent>, private toastr: ToastrService, private fb: FormBuilder, private customerService: CustomerService) {
    // Initialize the form with validation
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cin: ['', [Validators.required,]],
      password: ['', [Validators.required,]],
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;

      // Call the saveCustomer method from the service
      this.customerService.saveCustomer(customer).subscribe(
        (response) => {
          // Handle successful response
          this.toastr.success("Customer saved successfully");
          this.dialogRef.close();
        },
        (error) => {
          // Handle error response
          if (error.error?.errors?.email) this.toastr.error(error.error?.errors?.email);
          if (error.error?.errors?.name) this.toastr.error(error.error?.errors?.name);
          if (error.error?.errors?.cin) this.toastr.error(error.error?.errors?.cin);
          if (error.error?.errors?.password) this.toastr.error(error.error?.errors?.password);
          if (error.error?.exception) this.toastr.error(error.error?.exception);
          if (error.error?.error) this.toastr.error("Something went wrong! please try again");

          // Optionally, show an error message to the user

        }
      );
    } else {
      this.toastr.error('Form is invalid');
      // Optionally mark all fields as touched to show validation errors
      this.customerForm.markAllAsTouched();
    }
  }
}
