import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isCollapsed = true;
  constructor(public dialog: MatDialog, private router: Router,) { }
  notifications = [
    {
      title: 'Order Shipped',
      details: 'Your order has been shipped and will arrive in 3-5 business days.'
    },
    {
      title: 'New Message from John',
      details: 'John sent you a message: "Hey, are we still meeting tomorrow at 10 AM?"'
    },
    {
      title: 'Appointment Reminder',
      details: 'Your appointment with Dr. Smith is scheduled for tomorrow at 10 AM.'
    },
  ];

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

}
