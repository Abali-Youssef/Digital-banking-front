import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './components/customers/customers.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CardComponent } from './components/card/card.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './services/guards/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'dashboard',
    component: DashboardComponent, canActivateChild: [AuthGuard],
    children: [
      { path: 'accounts', component: AccountsComponent },
      { path: 'card', component: CardComponent },
      { path: 'customers', component: CustomersComponent },
      { path: '', redirectTo: 'accounts', pathMatch: 'full' }, // Default child route
    ],
  },
  { path: '**', redirectTo: 'auth' }, // Wildcard route for 404
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
