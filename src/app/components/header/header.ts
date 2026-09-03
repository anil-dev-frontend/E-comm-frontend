import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../core/services/category';
import { Router, RouterLink } from '@angular/router';
import { Authservice } from '../../core/services/authservice';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  categoryService = inject(Category);
  authService = inject(Authservice);
  router = inject(Router);

  categoryList: any[] = [];

  isLoggedIn:boolean = false;
  userName :string= '';
  isAdmin:boolean = false;
  searchValue:string = '';

  ngOnInit(): void {

    // Login status
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    // User name
    this.authService.userName$.subscribe((name) => {
      this.userName = name;
    });

    // Admin status
    this.authService.isAdmin$.subscribe((admin) => {
      this.isAdmin = admin;
    });

    // Categories
    this.categoryService.getCustomerCategories().subscribe({
      next: (result: any) => {

        if (
          result &&
          result.status === 'Y' &&
          result.data
        ) {
          this.categoryList = result.data;

        } else if (Array.isArray(result)) {
          this.categoryList = result;

        } else {
          this.categoryList = [];
        }
      },

      error: (err: any) => {
        console.error(
          'Error fetching customer categories:',
          err
        );

        this.categoryList = [];
      }
    });
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

  onSearch(event: any): void {
    const value = event.target.value?.trim();

    if (value) {
      this.router.navigate(['/products'], {
        queryParams: {
          search: value
        }
      });
    }
    this.searchValue = '';
  }

  searchCategory(id: any): void {
    if (id) {
      this.router.navigateByUrl(
        `/products?categoryId=${id}`
      );
    }
  }
}