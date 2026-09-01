import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { Category } from '../../../core/services/category';
import { Brand } from '../../../core/services/brand';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  productForm!: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  productId: string = '';
  stateData: any = null; 
  categoriesList: any[] = [];
  brandsList: any[] = [];

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(Category); 
  private brandService = inject(Brand); 

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.stateData = navigation?.extras.state?.['productData'];
  }

  ngOnInit(): void {

    // 1. Pehle form controls aur dropdowns load kiye
    this.formInit();
    this.loadDropdownData();

    // 2. Strict Sequential Execution Track:
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        // Edit mode strictly locks here
        this.isEditMode = true;
        this.productId = id;

        // Agar router state se data mila hai, toh yahan patch hoga
        if (this.stateData) {
          this.patchFormValues(this.stateData);
        }
      } else {
        // Agar URL me ID nahi hai, toh add mode chalega
        this.isEditMode = false;
        this.addImageField(); 
      }
    });
  }

  loadDropdownData(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => { 
        if (res && res.status === 'Y') {
          this.categoriesList = res.data; 
        } 
      },
      error: (err) => console.error('Category load error:', err)
    });

   
    this.brandService.getBrands().subscribe({
      next: (res) => { 
        if (res && res.status === 'Y') {
          this.brandsList = res.data; 
        } 
      },
      error: (err) => console.error('Brand load error:', err)
    });
  }



  formInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      shortDescription: [''],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      categoryId: ['', [Validators.required]],
      brandId: ['', [Validators.required]],
      imageUrl: this.fb.array([]) ,
      isFeatured:[false],
      isNewProduct:[false]
    });
  }

 
  get imageUrls(): FormArray {
    return this.productForm.get('imageUrl') as FormArray;
  }


  addImageField(value: string = ''): void {
    this.imageUrls.push(this.fb.control(value));
  }

 
  removeImageField(index: number): void {
    this.imageUrls.removeAt(index);
  }

 
    patchFormValues(data: any): void {
  //console.log(data)
    let extractedCategoryId = '';
    if (data.categoryId) {
      if (typeof data.categoryId === 'object' && data.categoryId._id) {
        extractedCategoryId = data.categoryId._id; 
      } else {
        extractedCategoryId = data.categoryId; 
      }
    }

    let extractedBrandId = '';
    if (data.brandId) {
      if (typeof data.brandId === 'object' && data.brandId._id) {
        extractedBrandId = data.brandId._id; 
      } else {
        extractedBrandId = data.brandId; 
      }
    }

    
    this.productForm.patchValue({
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      discount: data.discount,
      categoryId: extractedCategoryId,
      brandId: extractedBrandId ,
      isFeatured: data.isFeatured || false,
      isNewProduct: data.isNewProduct || false
    });

    // Puraane image input boxes ko clear karke database ke hisab se naye banayein
    this.imageUrls.clear();
    
    if (data.image && Array.isArray(data.image)) {
      data.image.forEach((imgUrl: string) => {
        this.addImageField(imgUrl);
      });
    }

    if (this.imageUrls.length === 0) {
      this.addImageField();
    }
  }

  onSubmit(): void {
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      this.isSubmitting = true;
      const formValue = this.productForm.value;
      
      const rawImages = this.imageUrls.value || [];
      const validImages = rawImages.filter((img: string) => img && img.trim() !== '');

      const requestPayload = {
        name: formValue.name,
        shortDescription: formValue.shortDescription,
        description: formValue.description,
        price: Number(formValue.price), 
        discount: Number(formValue.discount || 0),
        categoryId: formValue.categoryId,
        brandId: formValue.brandId, 
        image: validImages ,
        isFeatured: formValue.isFeatured,
        isNewProduct: formValue.isNewProduct
      };

      if (this.isEditMode) {
        this.updateProductLogic(requestPayload);
      } else {
        this.addProductLogic(requestPayload);
      }
    } else {
      alert('Please fill all required highlighted fields correctly.');
    }
  }

  // ---- 1. CLEAN INDEPENDENT SEPARATED OPERATIONS BLOCK FOR UPDATE API CONTEXT ----
  updateProductLogic(payload: any): void {
    this.productService.updateProduct(this.productId, payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response && response.status === 'Y') {
          alert('Product details updated successfully!');
          this.router.navigate(['/admin/products']); 
        } else {
          alert(response.message || 'Validation layer parameter rejection occurred.');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('PUT Request Interface Error Handler Loop:', err);
        alert('Server processing connection timed out.');
      }
    });
  }

  // ---- 2. CLEAN INDEPENDENT SEPARATED OPERATIONS BLOCK FOR CREATE API CONTEXT ----
  addProductLogic(payload: any): void {
    this.productService.createProduct(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response && response.status === 'Y') {
          alert('New Product entry created successfully!');
          this.router.navigate(['/admin/products']);
        } else {
          alert(response.message || 'Database transaction validation constraints validation failed.');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('POST Request Interface Error Handler Loop:', err);
        alert('Backend network stack endpoint handshake refused.');
      }
    });
  }
}