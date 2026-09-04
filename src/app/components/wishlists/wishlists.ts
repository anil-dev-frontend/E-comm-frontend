import { Component, OnInit } from '@angular/core';
import { Wishlist } from '../../core/services/wishlist';
import { ProductCard } from '../product-card/product-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlists',
  imports: [ProductCard,CommonModule],
  templateUrl: './wishlists.html',
  styleUrl: './wishlists.scss',
})
export class Wishlists implements OnInit {

  constructor(public wishlistService: Wishlist){}

  ngOnInit(): void {
    this.wishlistService.init();
  }
}
