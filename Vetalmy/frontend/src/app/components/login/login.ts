import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FloatLabelModule, InputTextModule, FormsModule, PasswordModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient // Inyectamos HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      this.http.post<any>('/auth/login', this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login correcto', res);


          localStorage.setItem('token', res.token);
          localStorage.setItem('user_role', res.user.rol);
          localStorage.setItem('user_id', res.user.id);
          localStorage.setItem('user_nombre', res.user.nombre);

          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          console.error('Error en el login', err);
          alert('Credenciales galácticas incorrectas');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  loginConGoogle(): void {
    const esLocal = window.location.hostname === 'localhost';
    const backendUrl = esLocal
      ? 'http://localhost:3000/api/auth/google'
      : 'https://tfg-vetalmy.onrender.com/api/auth/google';
    window.location.href = backendUrl;
  }
}
