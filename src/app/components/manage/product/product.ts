import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';

@Component({
  selector: 'app-product',
  imports: [
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    RouterLink
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product implements OnInit {

// Table me dikhane wale columns define kiye hain
  displayedColumns: string[] = ['image', 'name', 'category', 'price', 'discount', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([] as any);
  errorMessage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Saare products load karne ka function
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response && response.status === 'Y') {
          this.dataSource.data = response.data;
          
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          this.errorMessage = response.message || 'No products found.';
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorMessage = 'Failed to fetch products from backend server.';
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
    this.router.navigate(['admin/products/add', row._id], { 
    state: { productData: row } 
  });
  }

  // Product delete karne ka logic
  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          if (response && response.status === 'Y') {
            alert('Product deleted successfully!');
            this.loadProducts(); // Refresh table layout
          } else {
            alert(response.message || 'Failed to delete');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error while deleting product');
        }
      });
    }
  }
}
