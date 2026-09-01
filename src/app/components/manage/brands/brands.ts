import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Brand } from '../../../core/services/brand';

@Component({
  selector: 'app-brands',
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
  templateUrl: './brands.html',
  styleUrl: './brands.scss',
})
export class Brands implements OnInit {

  displayedColumns: string[] = ['_id', 'name', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([] as any);
  errorMessage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Category service ki jagah BrandService inject kiya
  private brandService = inject(Brand);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadBrands();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Brands fetch karne ka dynamic logic
  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (response) => {
        if (response && response.status === 'Y') {
          this.dataSource.data = response.data;
          
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          this.errorMessage = response.message || 'No brands found.';
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorMessage = 'Failed to fetch brands from backend server.';
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

  // Redirect to Brand Edit Form with State Data
  onEdit(row: any): void {
    this.router.navigate(['admin/brands/add'], { 
      state: { brandData: row } 
    });
  }

  // Final Delete Action Logic for Brand
  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe({
        next: (response) => {
          if (response && response.status === 'Y') {
            alert('Brand deleted successfully!');
            this.loadBrands(); // Table refresh karne ke liye
          } else {
            alert(response.message || 'Failed to delete');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error while deleting brand');
        }
      });
    }
  }
}


