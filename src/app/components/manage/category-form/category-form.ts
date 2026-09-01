import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../../core/services/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm implements OnInit {

  categoryForm!: FormGroup;
  isSubmitting = false;
  isEditMode = false; 
  categoryId: string = ''; 
  editData: any = null; // State data hold karne ke liye variable

  private fb = inject(FormBuilder);
  private categoryService = inject(Category);
  private router = inject(Router);

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.editData = navigation?.extras.state?.['categoryData'];

    if (this.editData) {
      this.isEditMode = true;
      this.categoryId = this.editData._id;
    }
  }

  ngOnInit(): void {
    
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]]
    });

    
    if (this.isEditMode && this.editData) {
      this.categoryForm.patchValue({
        name: this.editData.name
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;

      if (this.isEditMode) {
        // ---- EDIT MODE: Update API Call ----
        this.categoryService.updateCategory(this.categoryId, this.categoryForm.value).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            if (response && response.status === 'Y') {
              alert('Category updated successfully!');
              this.router.navigate(['/admin/categories']); 
            } else {
              alert(response.message || 'Failed to update category');
            }
          },
          error: (err) => {
            this.isSubmitting = false;
            alert('Something went wrong during update.');
          }
        });

      } else {
        // ---- ADD MODE: Create API Call ----
        this.categoryService.createCategory(this.categoryForm.value).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            if (response && response.status === 'Y') {
              alert('Category added successfully!');
              this.router.navigate(['/admin/categories']);
            } else {
              alert(response.message || 'Failed to save category');
            }
          },
          error: (err) => {
            this.isSubmitting = false;
            alert('Something went wrong with backend.');
          }
        });
      }
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}