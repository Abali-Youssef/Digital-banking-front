import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../../services/customer-service/customer.service';
import { Customer } from '../../../../services/models/customer';
import { LoginService } from '../../../../services/auth/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  hideLoginPassword: boolean = true;
  selectedTabIndex: number = 0;
  hidePassword = true;
  hideConfirmPassword = true;
  isPasswordMatched: boolean = true;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<LoginFormComponent>,
    private customerService: CustomerService,
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {


    this.initializeForms();
  }

  initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        cin: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
    );
  }
  passwordsMatchValidator(): void {
    const password = this.registerForm.get('registerPassword')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    this.isPasswordMatched = password === confirmPassword

  }
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      // Perform login action here
      this.loginService.login(loginData).subscribe(
        (response) => {
          const token = response.accessToken;

          // Store access token in local storage
          localStorage.setItem("accessToken", token);

          // Decode the JWT token (assuming it's in JWT format)
          const payload = this.decodeJwt(token);

          if (payload) {
            // Extract and store authorities and expiration date
            const authorities = payload.scope || [];
            const expirationDate = new Date(payload.exp * 1000); // Convert exp (in seconds) to milliseconds

            localStorage.setItem("scope", JSON.stringify(authorities).replace(/^"|"$/g, ''));
            localStorage.setItem("exp", expirationDate.toISOString());


            this.toastr.success("logged in successfully");
            this.dialogRef.close();
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          // Handle error response
          if (error.error?.errors?.email) this.toastr.error(error.error?.errors?.email);
          if (error.error?.errors?.name) this.toastr.error(error.error?.errors?.name);
          if (error.error?.errors?.cin) this.toastr.error(error.error?.errors?.cin);
          if (error.error?.errors?.password) this.toastr.error(error.error?.errors?.password);
          if (error.error?.exception) this.toastr.error(error.error?.exception);
          if (error.error?.error) this.toastr.error("Something went wrong! please try again");
        }
      );
    } else {
      this.toastr.error('Please fix the errors in the login form.');
      this.loginForm.markAllAsTouched();
    }
  }
  decodeJwt(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1]; // JWT format: header.payload.signature
      const decodedPayload = atob(payloadBase64);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }
  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const customer: Customer = this.registerForm.value;

      // Call the saveCustomer method from the service
      this.customerService.saveCustomer(customer).subscribe(
        (response) => {
          // Handle successful response
          this.toastr.success("Customer saved successfully");
        },
        (error) => {
          // Handle error response
          if (error.error?.errors?.email) this.toastr.error(error.error?.errors?.email);
          if (error.error?.errors?.name) this.toastr.error(error.error?.errors?.name);
          if (error.error?.errors?.cin) this.toastr.error(error.error?.errors?.cin);
          if (error.error?.errors?.password) this.toastr.error(error.error?.errors?.password);
          if (error.error?.exception) this.toastr.error(error.error?.exception);
          if (error.error?.error) this.toastr.error("Something went wrong! please try again");
        }
      );
    } else {
      this.toastr.error('Form is invalid');
      // Optionally mark all fields as touched to show validation errors
      this.registerForm.markAllAsTouched();
    }
  }
}
