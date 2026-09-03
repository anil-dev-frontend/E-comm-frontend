import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product-service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    DecimalPipe
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {

 product: any = null;

  selectedImage = '';

  quantity = 1;

  reviews: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    this.route.params.subscribe(params => {

      const id = params['id'];

      if (id) {
        this.getProduct(id);
      }

    });

  }

  getProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.product = res.data;

        if (this.product?.image?.length > 0) {
          this.selectedImage = this.product.image[0];
        }

      },

      error: (error) => {
        console.error('PRODUCT DETAIL ERROR:', error);
      }

    });

  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    console.log('Add to Cart:', this.product, this.quantity);
  }

  buyNow(): void {
    console.log('Buy Now:', this.product, this.quantity);
  }

  getSellingPrice(): number {
  const price = Number(this.product?.price || 0);
  const discount = Number(this.product?.discount || 0);

  return Number((price - (price * discount / 100)).toFixed(2));
}

}