import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product-service';
import { ProductCard } from '../product-card/product-card';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../core/services/category';
import { Brand } from '../../core/services/brand';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    FormsModule,
    ProductCard
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {

  products: any[] = [];
  searchTerm = '';
  categoryId = '';
  brandId = '';

  page = 1;
  pageSize = 8;

  totalProducts = 0;
  totalPages = 0;
  loading = false;
  categories: any[] = [];
  brands: any[] = [];
  sortOrder:string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryService: Category,
    private brandService: Brand,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      console.log('Search Term:', this.searchTerm);
      this.page = 1;
       this.loadCategories();
       this.loadBrands();
      this.loadProducts();
    });

  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data || [];
      },
      error: (error) => {
        this.categories = [];
      }
    });
  }

  loadBrands(): void {
    this.brandService.getCustomerBrands().subscribe({
      next: (res) => {
        this.brands = res.data || [];
      },
      error: (error) => {
        this.brands = [];
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProductList(
      this.searchTerm.trim(),
      this.categoryId,
      this.brandId,
      this.page,
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.totalProducts = res.pagination?.total || 0;
        this.page = res.pagination?.page || 1;
        this.pageSize = res.pagination?.pageSize || 8;
        this.totalPages = res.pagination?.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        this.products = [];
        this.totalProducts = 0;
        this.totalPages = 0;
        this.loading = false;
      }
    });
  }


  onSearch(): void {
    this.page = 1;
    this.loadProducts();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadProducts();
  }


  clearFilters(): void {
    this.searchTerm = '';
    this.categoryId = '';
    this.brandId = '';
    this.page = 1;
    this.loadProducts();

  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadProducts();
    }
  }

sortProducts(): void {
  if (this.sortOrder === 'lowToHigh') {
    this.products.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  }

  if (this.sortOrder === 'highToLow') {
    this.products.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }
}
}