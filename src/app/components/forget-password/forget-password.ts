import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Authservice } from '../../core/services/authservice';

@Component({
  selector: 'app-forget-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
})
export class ForgetPassword {

forgotForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendOtp() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        position: 'center',
        confirmButtonColor: '#2563eb'
      });

      return;
    }

    const email = this.forgotForm.get('email')?.value;
    this.loading = true;

    this.authService.forgetPassword(email).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Forgot Password Response:', response);

        if (response.status === 'Y') {
          // Reset page ke liye email save kar rahe hain
          sessionStorage.setItem('resetEmail', email);

          Swal.fire({
            icon: 'success',
            title: 'OTP Generated',
            html: `
              <p>${response.message || 'OTP generated successfully.'}</p>
              <p class="mt-3"><b>OTP: ${response.otp}</b></p>
              <p class="mt-2 text-gray-500">OTP is valid for 3 minutes.</p>
            `,
            position: 'center',
            confirmButtonText: 'Reset Password',
            confirmButtonColor: '#2563eb'
          }).then(() => {
            this.router.navigate(['/reset-password']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'OTP Failed',
            text: response.message || 'Unable to generate OTP.',
            position: 'center',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.log('Forgot Password Error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong',
          text: error?.error?.message || 'Unable to generate OTP. Please try again.',
          position: 'center',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
