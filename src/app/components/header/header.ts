import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../core/services/category';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  categoryService = inject(Category);
  categoryList: any[] = []; 
  router = inject(Router);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (result) => {
        if (result && result.status === 'Y' && result.data) {
          this.categoryList = result.data; 
        } else if (Array.isArray(result)) {
          this.categoryList = result; 
        }
      },
      error: (err) => {
        console.error('Error fetching global layout categories:', err);
      }
    });
  }

  onSearch(event:any){
    const value = event.target.value?.trim();
    if (value) {
      this.router.navigate(['/products'], { 
        queryParams: { search: value } 
      });
    }

  }

  searchCategory(id:any){
    if (id) {
      this.router.navigateByUrl(`/products?categoryId=${id}`);
    }
  }
}