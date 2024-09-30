import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../models/customer';
import { CustomerService } from '../service/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent implements OnInit {

  addCustomerForm!: FormGroup;
  constructor(private fb: FormBuilder, private customerService: CustomerService, private router: Router) { }
  ngOnInit(): void {
    this.addCustomerForm = this.fb.group(
      {
        name: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
        email: this.fb.control(null, [Validators.email, Validators.required]),
      });
  }

  handleSaveCustomer() {
    let customer: Customer = this.addCustomerForm.value;
    this.customerService.saveCustomer(customer).subscribe(
      {
        next: data => {
          alert("customer saved successfully");
          this.addCustomerForm.reset;
          this.router.navigateByUrl("/customers")
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }

}
