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
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 login() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();

    Swal.fire({
      icon: 'warning',
      title: 'Invalid Form',
      text: 'Please enter valid email and password.',
      position: 'center'
    });

    return;
  }

  this.loading = true;

  const loginData = this.loginForm.value;

  this.authService.login(loginData).subscribe({
    next: (response) => {

      this.loading = false;

      if (response.status === 'Y') {

        // AuthService ke through login state set karo
        this.authService.setLogin(
          response.token,
          response.user
        );

        this.loginForm.reset();

        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back ${response.user?.name || ''}`,
          position: 'center',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/']);
        });

      } else {

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: response.message || 'Invalid email or password.',
          position: 'center'
        });

      }
    },

    error: (error) => {

      this.loading = false;

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error?.error?.message || 'Invalid email or password.',
        position: 'center'
      });

    }
  });
}

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
}