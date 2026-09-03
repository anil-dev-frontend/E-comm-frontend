import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Authservice } from '../../core/services/authservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  // ============================
  // REGISTER
  // ============================
  register() {
    this.errorMessage = '';
    this.successMessage = '';

    // Form validation
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all required fields correctly.',
        position: 'center',
        confirmButtonColor: '#2563eb'
      });

      return;
    }

    // Password match check
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Password and confirm password do not match.';

      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Password and confirm password do not match.',
        position: 'center',
        confirmButtonColor: '#dc2626'
      });

      return;
    }

    this.loading = true;

    // API data
    const registerData = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    };

    // API call
    this.authService.signup(registerData).subscribe({
      next: (response) => {
        this.loading = false;

        console.log('Register Response:', response);

        if (response.status === 'Y') {
          this.successMessage = response.message || 'Account created successfully!';
          this.registerForm.reset();

          Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: response.message || 'Your account has been created successfully.',
            position: 'center',
            confirmButtonText: 'Go to Login',
            confirmButtonColor: '#2563eb'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          this.errorMessage = response.message || 'Registration failed.';

          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: response.message || 'Registration failed.',
            position: 'center',
            confirmButtonColor: '#dc2626'
          });
        }
      },

      error: (error) => {
        this.loading = false;

        console.log('Register Error:', error);

        this.errorMessage =
          error?.error?.message || 'Something went wrong. Please try again.';

        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error?.error?.message || 'Something went wrong. Please try again.',
          position: 'center',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}