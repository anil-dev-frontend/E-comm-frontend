import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category } from '../../../core/services/category';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  
  displayedColumns: string[] = ['_id', 'name','action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([] as any);
  errorMessage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  categoryService = inject(Category);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response && response.status === 'Y') {
          this.dataSource.data = response.data;
          
          // Async data ke liye paginator refresh
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          this.errorMessage = response.message || 'No categories found.';
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorMessage = 'Failed to fetch categories from backend server.';
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(row: any): void {
  this.router.navigate(['admin/categories/add'], { 
    state: { categoryData: row } 
  });
}

  // Final Delete Action Logic
  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: (response) => {
          if (response && response.status === 'Y') {
            alert('Category deleted successfully!');
            this.loadCategories(); // Table refresh karne ke liye
          } else {
            alert(response.message || 'Failed to delete');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error while deleting category');
        }
      });
    }
  }
}
