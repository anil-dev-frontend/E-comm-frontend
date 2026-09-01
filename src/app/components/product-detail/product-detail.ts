import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {

  ngOnInit(): void {
    window.scrollTo({top: 0,left: 0,behavior: 'smooth' });
  }

}
