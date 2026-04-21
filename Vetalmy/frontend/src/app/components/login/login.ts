import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FloatLabelModule, InputTextModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  value: string | undefined;

  // El formBuilder para crear el formulario
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      // Campo email: empieza vacío, es obligatorio y debe tener formato de email
      email: ['', [Validators.required, Validators.email]],
      // Campo contraseña: empieza vacío, es obligatorio y mínimo 6 caracteres
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Se ejecutará cuando el usuario pulse "Entrar"
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('¡Éxito!', this.loginForm.value);
      this.router.navigate(['/inicio']);
    } else {
      console.log('El formulario tiene errores.');
      // Si el usuario le da a "Entrar" sin rellenar nada, sale un mensaje de error
      this.loginForm.markAllAsTouched();
    }
  }

  // Getters
  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}