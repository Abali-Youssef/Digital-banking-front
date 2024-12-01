import { Component, input, output } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

  constructor(public auth: LoginService,) { }
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [


    {
      routeLink: 'customers',
      icon: 'fal fa-user',
      label: 'Customers',
      auth: 'CUSTOMER',
    },
    {
      routeLink: 'accounts',
      icon: 'fal fa-university',
      label: 'Accounts',
      auth: 'ACCOUNT',
    },
    {
      routeLink: 'card',
      icon: 'fal fa-credit-card',
      label: 'Cards',
      auth: 'CARD',
    },

  ];
  toggleCollapse() {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }
  closeSideNav() {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
