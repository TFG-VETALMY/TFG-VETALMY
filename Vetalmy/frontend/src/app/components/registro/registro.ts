import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FloatLabelModule, InputTextModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
  standalone: true,
})
export class RegistroComponent {
  value: string | undefined;
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Estructura del Form
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      // Valida que las contraseñas coincidan
      validators: this.passwordMatchValidator
    });
  }

  //El validador de contraseñas
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  // Getters
  get nombreControl() { return this.registroForm.get('nombre'); }
  get emailControl() { return this.registroForm.get('email'); }
  get passwordControl() { return this.registroForm.get('password'); }
  get confirmControl() { return this.registroForm.get('confirmPassword'); }

  onRegister() {
    if (this.registroForm.valid) {
      console.log('Enviando datos a la base de datos de Vetalmy...', this.registroForm.value);
    }
  }
}
