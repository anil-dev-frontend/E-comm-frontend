import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Brand } from '../../../core/services/brand';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './brands-form.html',
  styleUrl: './brands-form.scss',
})
export class BrandsForm implements OnInit {

  brandForm!: FormGroup;
  isSubmitting = false;
  isEditMode = false; 
  brandId: string = ''; 
  editData: any = null; 

  private fb = inject(FormBuilder);
  private brandService = inject(Brand); 
  private router = inject(Router);

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.editData = navigation?.extras.state?.['brandData']; 

    if (this.editData) {
      this.isEditMode = true;
      this.brandId = this.editData._id;
    }
  }

  ngOnInit(): void {
    // Form control model configuration
    this.brandForm = this.fb.group({
      name: ['', [Validators.required]]
    });

    // Form value patch agar data state me mila ho
    if (this.isEditMode && this.editData) {
      this.brandForm.patchValue({
        name: this.editData.name
      });
    }
  }

  onSubmit(): void {
    if (this.brandForm.valid) {
      this.isSubmitting = true;
      if (this.isEditMode) {
        this.updateBrandLogic();
      } else {
        this.addBrandLogic();
      }
    } else {
      this.brandForm.markAllAsTouched();
    }
  }

  // ---- 1. SEPARATE UPDATE BRAND LOGIC ----
  updateBrandLogic(): void {
    this.brandService.updateBrand(this.brandId, this.brandForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response && response.status === 'Y') {
          alert('Brand updated successfully!');
          this.router.navigate(['/admin/brands']); // Admin brand list layout par bhejega
        } else {
          alert(response.message || 'Failed to update brand');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Update Error:', err);
        alert('Something went wrong during brand update.');
      }
    });
  }

  // ---- 2. SEPARATE ADD BRAND LOGIC ----
  addBrandLogic(): void {
    this.brandService.createBrand(this.brandForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response && response.status === 'Y') {
          alert('Brand added successfully!');
          this.router.navigate(['/admin/brands']); // Save hone par redirect
        } else {
          alert(response.message || 'Failed to save brand');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Create Error:', err);
        alert('Something went wrong with backend database connection.');
      }
    });
  }
}


