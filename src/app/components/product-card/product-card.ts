import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule,RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
@Input() product: any; 
constructor(private router: Router) {}

  getSellingPrice(): number {
  const price = Number(this.product?.price || 0);
  const discount = Number(this.product?.discount || 0);

  return Number((price - (price * discount / 100)).toFixed(2));
}
}
