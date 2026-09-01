import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Customerservice } from '../../core/services/customerservice';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink,ProductCard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA], 
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
 
 @ViewChild('sliderContainer') sliderContainer!: ElementRef; // HTML scrolling hook capture
  
  private customerService = inject(Customerservice);

  newProducts: any[] = [];
  featuredProducts: any[] = [];
  bannerImages: any[] = [];
  
  // Custom Autoplay Slider Properties
  activeSlideIndex = 0;
  autoplayTimer: any;

  ngOnInit(): void {
    this.loadNewProducts();
    this.loadFeaturedProducts();
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  loadNewProducts(): void {
    this.customerService.getHomeNewProducts().subscribe({
      next: (response) => {
        if (response && response.status === 'Y') {
          this.newProducts = response.data;
          this.bannerImages = response.data;
        }
      }
    });
  }

  loadFeaturedProducts(): void {
    this.customerService.getHomeFeaturedProducts().subscribe({
      next: (response) => {
        if (response && response.status === 'Y') {
          this.featuredProducts = response.data;
          this.bannerImages = response.data;
        }
      }
    });
  }

  // ---- CAROUSEL LOGIC OPERATIONS (Bina kisi external packages ke) ----
  getDotCount(): any[] {
    if (!this.bannerImages.length) return [];
    // Kyunki ek baar me 3 product dikhte hain, total dots counting set karein
    const dotsNeeded = Math.ceil(this.bannerImages.length - 2);
    return new Array(dotsNeeded > 0 ? dotsNeeded : 1);
  }

  scrollToSlide(index: number): void {
    if (!this.sliderContainer) return;
    this.activeSlideIndex = index;
    const container = this.sliderContainer.nativeElement;
    
    // Har individual slide element box ki full widths nikal kar window push kiya
    const slideWidth = container.querySelector('.snap-start')?.offsetWidth || 0;
    const gap = 16; // gap-4 is equal to 16px padding grids
    
    container.scrollTo({
      left: index * (slideWidth + gap),
      behavior: 'smooth'
    });
  }

  startAutoplay(): void {
    this.autoplayTimer = setInterval(() => {
      if (this.bannerImages.length > 3) {
        const totalDots = this.getDotCount().length;
        let nextIndex = this.activeSlideIndex + 1;
        if (nextIndex >= totalDots) {
          nextIndex = 0;
        }
        this.scrollToSlide(nextIndex);
      }
    }, 3500); // Har 3.5 seconds me slide automatic badlegi
  }

  stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
  }
}