import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-registro',
  imports: [
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    RouterModule
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
  standalone: true,
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  // Getters para validaciones en el HTML
  get nombreControl() { return this.registroForm.get('nombre'); }
  get emailControl() { return this.registroForm.get('email'); }
  get passwordControl() { return this.registroForm.get('password'); }
  get confirmControl() { return this.registroForm.get('confirmPassword'); }



  onRegister() {
    if (this.registroForm.valid) {
      // Extraemos solo los campos que el backend espera (nombre, email, password)
      const { nombre, email, password } = this.registroForm.value;
      const datosRegistro = { nombre, email, contrasenia: password };

      const url = '/auth/register';
      console.log('Enviando datos a la base de datos de Vetalmy...', url, datosRegistro);

      // Llamada al backend a través del interceptor
      this.http.post(url, datosRegistro).subscribe({
        next: (res) => {
          console.log('¡Usuario registrado con éxito!', res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la cuenta. Revisa si el email ya existe o si el servidor está activo.' });
        }
      });
    }
  }
}
