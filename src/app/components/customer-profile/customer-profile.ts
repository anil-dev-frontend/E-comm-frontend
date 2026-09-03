import { Component } from '@angular/core';
import { Authservice } from '../../core/services/authservice';

@Component({
  selector: 'app-customer-profile',
  imports: [],
  templateUrl: './customer-profile.html',
  styleUrl: './customer-profile.scss',
})
export class CustomerProfile {

userName = '';
  email = '';

  constructor(private authService: Authservice) {

    this.authService.userName$.subscribe(name => {
      this.userName = name;
    });

    const user = localStorage.getItem('user');

    if (user) {
      const userData = JSON.parse(user);
      this.email = userData?.email || '';
    }
  }
}
