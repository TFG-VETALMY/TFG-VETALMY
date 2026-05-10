import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importante para conectar con el backend
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-registro',
  imports: [
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
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
    private http: HttpClient, // Inyectamos el cliente HTTP
    private router: Router     // Inyectamos el router para navegar
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

      const url = `${environment.apiUrl}/auth/register`;
      console.log('Enviando datos a la base de datos de Vetalmy...', url, datosRegistro);

      // Llamada al backend a través del proxy de Vercel
      this.http.post(url, datosRegistro).subscribe({
        next: (res) => {
          console.log('¡Usuario registrado con éxito!', res);
          // Si el registro es correcto, lo mandamos al login
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          alert('No se pudo crear la cuenta. Revisa si el email ya existe o si el servidor está activo.');
        }
      });
    }
  }
}
