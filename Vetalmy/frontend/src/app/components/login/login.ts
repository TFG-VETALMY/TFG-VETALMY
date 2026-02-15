import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  // El formBuilder para crear el formulario
  constructor(private fb: FormBuilder) {
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
      console.log('¡Éxito! Datos listos para enviar al backend:', this.loginForm.value);
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