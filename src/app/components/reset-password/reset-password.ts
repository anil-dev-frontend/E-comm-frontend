import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Authservice } from '../../core/services/authservice';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {

resetForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private router: Router
  ) {
    this.email = sessionStorage.getItem('resetEmail') || '';

    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  resetPassword() {
    if (!this.email) {
      Swal.fire({
        icon: 'error',
        title: 'Email Missing',
        text: 'Please start the forgot password process again.',
        position: 'center',
        confirmButtonColor: '#dc2626'
      }).then(() => {
        this.router.navigate(['/forgot-password']);
      });

      return;
    }

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all fields correctly.',
        position: 'center',
        confirmButtonColor: '#2563eb'
      });

      return;
    }

    const newPassword = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'New password and confirm password do not match.',
        position: 'center',
        confirmButtonColor: '#dc2626'
      });

      return;
    }

    const resetData = {
      email: this.email,
      otp: this.resetForm.get('otp')?.value,
      newPassword: newPassword
    };

    this.loading = true;

    this.authService.resetPassword(resetData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Reset Password Response:', response);

        if (response.status === 'Y') {
          sessionStorage.removeItem('resetEmail');
          this.resetForm.reset();

          Swal.fire({
            icon: 'success',
            title: 'Password Reset Successful!',
            text: response.message || 'Your password has been changed successfully.',
            position: 'center',
            confirmButtonText: 'Go to Login',
            confirmButtonColor: '#2563eb'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Reset Failed',
            text: response.message || 'Unable to reset password.',
            position: 'center',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.log('Reset Password Error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: error?.error?.message || 'Invalid OTP or OTP expired.',
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
