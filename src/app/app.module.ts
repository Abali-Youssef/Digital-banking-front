import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { CustomersComponent } from './components/customers/customers.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule here

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './components/main/main.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CardComponent } from './components/card/card.component';
import { CommonModule } from '@angular/common';


import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { CardModalComponent } from './components/card/modals/card-modal/card-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AddAccountModalComponent } from './components/accounts/modals/add-account-modal/add-account-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddCustomerModalComponent } from './components/customers/modals/add-customer-modal/add-customer-modal.component';


import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditCustomerModalComponent } from './components/customers/modals/edit-customer-modal/edit-customer-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs'; // Import MatTabsModule

import { ToastrModule } from 'ngx-toastr';
import { EditCardModalComponent } from './components/card/modals/edit-card-modal/edit-card-modal.component';
import { EditAccountModalComponent } from './components/accounts/modals/edit-account-modal/edit-account-modal.component';
import { AccountHistoryModalComponent } from './components/accounts/modals/account-history-modal/account-history-modal.component';
import { AccountOperationModalComponent } from './components/accounts/modals/account-operation-modal/account-operation-modal.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginFormComponent } from './components/auth/modals/login-form/login-form.component';
import { AuthInterceptor } from './services/security/authInterceptor';


@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    CustomersComponent,
    NavbarComponent,


    SidenavComponent,
    DashboardComponent,
    MainComponent,
    CardComponent,
    CardModalComponent,
    EditCardModalComponent,
    AddAccountModalComponent,
    AddCustomerModalComponent,

    EditCustomerModalComponent,
    EditAccountModalComponent,
    AccountHistoryModalComponent,
    AccountOperationModalComponent,
    AuthComponent,
    LoginFormComponent,

  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    // 
    MatDialogModule,
    MatDialogContent,
    MatAutocompleteModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ///
    MatExpansionModule,       // For the accordion
    MatButtonModule,          // For buttons
    MatIconModule,
    NgbModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      easeTime: 300,
      preventDuplicates: true, // Prevent duplicate toasts
    }),// ToastrModule added
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
