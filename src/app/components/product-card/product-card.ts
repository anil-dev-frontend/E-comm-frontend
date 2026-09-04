import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Wishlist } from '../../core/services/wishlist';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule,RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
 

@Input() product: any; 
constructor(private router: Router,private wishlistService: Wishlist) {}


  getSellingPrice(): number {
  const price = Number(this.product?.price || 0);
  const discount = Number(this.product?.discount || 0);

  return Number((price - (price * discount / 100)).toFixed(2));
}

addToWishList(product: any): void {

  const isExist = this.wishlistService.wishList.find(
    (x: any) => x._id === product._id
  );

  if (isExist) {

    // REMOVE
    this.wishlistService.removeFromWishlist(product._id).subscribe({
      next: (result) => {
        console.log('Removed from wishlist:', result);
        this.wishlistService.wishList =
          this.wishlistService.wishList.filter(
            (x: any) => x._id !== product._id
          );
      },
      error: (error) => {
        console.error('Remove wishlist error:', error);
      }
    });

  } else {

    // ADD
    this.wishlistService.addToWishlist(product._id).subscribe({
      next: (result) => {
        console.log('Added to wishlist:', result);

        this.wishlistService.wishList.push(product);
      },
      error: (error) => {
        console.error('Add wishlist error:', error);
      }
    });

  }
}

isInWishlist(product: any): boolean {
  let isExist = this.wishlistService.wishList.find(
    (x: any) => x._id === product._id
  );

  if (isExist) {
    return true;
  } else {
    return false;
  }
}
}
