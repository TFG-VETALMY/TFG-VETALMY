import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface UsuarioPerfil {
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email: string;
  rol: string;
  foto?: string;
}

@Component({
  selector: 'app-mi-cuenta',
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.css',
})
export class MiCuenta implements OnInit {

  seccionActiva: 'perfil' | 'mascotas' | 'citas' = 'perfil';
  usuario: UsuarioPerfil | null = null;
  mascotas: any[] = [];
  historialCitas: any[] = [];
  mascotaExpandida: number | null = null;


  // Modo edición
  editando = false;
  guardando = false;
  form: Partial<UsuarioPerfil> = {};
  mensajeExito = '';
  mensajeError = '';

  // Cambio de contraseña
  mostrarFormPassword = false;
  passwordForm = { actual: '', nueva: '', confirmar: '' };
  passwordGuardando = false;
  passwordExito = '';
  passwordError = '';
  mostrarActual = false;
  mostrarNueva = false;
  mostrarConfirmar = false;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.seccionActiva = params['tab'] as any;
      }
    });
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.http.get<UsuarioPerfil>(`/usuarios/${userId}`).subscribe({
        next: (u) => {
          this.usuario = u;
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: () => {}
      });

      this.http.get<any[]>('/mascotas').subscribe({
        next: (todas) => {
          const esVet = localStorage.getItem('user_role') === 'veterinario';
          this.mascotas = esVet ? todas : todas.filter(m => m.usuarioId === Number(userId));
          
          this.http.get<any[]>('/citas').subscribe({
            next: (citas) => {
              this.historialCitas = citas.filter(c => c.estado === 'COMPLETADA');
              
              this.mascotas.forEach(m => {
                m.proximasCitas = citas.filter(c => c.estado !== 'COMPLETADA' && c.mascota?.id === m.id);
                
                this.http.get<any>(`/historial/mascota/${m.id}`).subscribe({
                  next: (h) => {
                    m.historial = h;
                    this.cdr.detectChanges();
                  }
                });
              });
              this.cdr.detectChanges();
            }
          });
        }
      });
    }
  }

  get userInicial(): string {
    return this.usuario?.nombre?.charAt(0).toUpperCase() ?? '?';
  }

  get userFoto(): string {
    return this.usuario?.foto || localStorage.getItem('user_foto') || '';
  }

  get esVeterinario(): boolean {
    return this.usuario?.rol === 'veterinario';
  }

  get nombreCompleto(): string {
    return [this.usuario?.nombre, this.usuario?.apellido1, this.usuario?.apellido2]
      .filter(Boolean).join(' ');
  }

  resetForm(): void {
    this.form = { ...this.usuario };
  }

  activarEdicion(): void {
    this.resetForm();
    this.editando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.resetForm();
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  guardarCambios(): void {
    if (!this.usuario || !this.form.nombre || !this.form.email) return;
    this.guardando = true;
    this.mensajeError = '';
    this.cdr.detectChanges();

    const payload = {
      nombre: this.form.nombre,
      apellido1: this.form.apellido1 || null,
      apellido2: this.form.apellido2 || null,
      email: this.form.email,
    };

    this.http.patch<UsuarioPerfil>(`/usuarios/${this.usuario.id}`, payload)
      .pipe(
        timeout(8000),
        catchError(err => {
          this.guardando = false;
          this.mensajeError = err.name === 'TimeoutError'
            ? 'La petición tardó demasiado. Inténtalo de nuevo.'
            : 'No se pudo guardar. Inténtalo de nuevo.';
          this.cdr.detectChanges();
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (updated) => {
          this.usuario = { ...updated };
          localStorage.setItem('user_nombre', updated.nombre);
          this.editando = false;
          this.guardando = false;
          this.mensajeExito = '¡Perfil actualizado correctamente!';
          this.cdr.detectChanges();
          setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
        }
      });
  }

  cambiarContrasenia(): void {
    this.passwordError = '';
    this.passwordExito = '';

    if (!this.passwordForm.nueva || !this.passwordForm.confirmar) {
      this.passwordError = 'Rellena todos los campos.';
      this.cdr.detectChanges();
      return;
    }
    if (this.passwordForm.nueva.length < 6) {
      this.passwordError = 'La nueva contraseña debe tener al menos 6 caracteres.';
      this.cdr.detectChanges();
      return;
    }
    if (this.passwordForm.nueva !== this.passwordForm.confirmar) {
      this.passwordError = 'Las contraseñas no coinciden.';
      this.cdr.detectChanges();
      return;
    }

    this.passwordGuardando = true;
    this.cdr.detectChanges();

    this.http.patch(`/usuarios/${this.usuario!.id}/contrasenia`, { contrasenia: this.passwordForm.nueva })
      .pipe(
        timeout(8000),
        catchError(err => {
          this.passwordGuardando = false;
          this.passwordError = err.name === 'TimeoutError'
            ? 'La petición tardó demasiado. Inténtalo de nuevo.'
            : 'No se pudo cambiar la contraseña.';
          this.cdr.detectChanges();
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => {
          this.passwordGuardando = false;
          this.passwordExito = '¡Contraseña cambiada correctamente!';
          this.passwordForm = { actual: '', nueva: '', confirmar: '' };
          this.mostrarFormPassword = false;
          this.cdr.detectChanges();
          setTimeout(() => { this.passwordExito = ''; this.cdr.detectChanges(); }, 4000);
        }
      });
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }

  toggleMascota(id: number) {
    this.mascotaExpandida = this.mascotaExpandida === id ? null : id;
    this.cdr.detectChanges();
  }

  anadirVacuna(mascota: any, nombre: string, fechaStr: string): void {
    if (!nombre || !fechaStr) {
      alert('Por favor rellena el nombre y la fecha de la vacuna.');
      return;
    }
    
    this.obtenerOCrearHistorial(mascota.id, (historialId) => {
      const payload = {
        nombre: nombre,
        fecha_aplicacion: new Date(fechaStr),
        historialId: historialId
      };

      this.http.post<any>('/vacunas', payload).subscribe({
        next: () => {
          // Registrar automáticamente la cita de vacunación como completada
          const citaPayload = {
            fecha: new Date(fechaStr),
            tipo: 'Vacunación',
            estado: 'COMPLETADA',
            motivo: `Vacunación: ${nombre}`,
            mascotaId: mascota.id,
            clienteId: mascota.usuarioId || mascota.usuario?.id,
            veterinarioId: this.usuario?.id
          };
          this.http.post<any>('/citas', citaPayload).subscribe();

          this.recargarHistorialMascota(mascota);
        },
        error: () => alert('Error al añadir la vacuna.')
      });
    });
  }

  anadirEnfermedad(mascota: any, observaciones: string, fechaStr: string, dadaAlta: boolean): void {
    if (!observaciones || !fechaStr) {
      alert('Por favor rellena el diagnóstico y la fecha.');
      return;
    }

    this.obtenerOCrearHistorial(mascota.id, (historialId) => {
      const payload = {
        observaciones: observaciones,
        fecha_diagnostico: new Date(fechaStr),
        fecha_alta: dadaAlta ? new Date() : null,
        historialId: historialId,
        veterinarioId: this.usuario?.id
      };

      this.http.post<any>('/enfermedades', payload).subscribe({
        next: () => {
          this.recargarHistorialMascota(mascota);
        },
        error: () => alert('Error al añadir la enfermedad.')
      });
    });
  }

  obtenerOCrearHistorial(mascotaId: number, callback: (historialId: number) => void): void {
    this.http.get<any>(`/historial/mascota/${mascotaId}`).subscribe({
      next: (h) => {
        if (h) {
          callback(h.id);
        } else {
          this.http.post<any>('/historial', { mascotaId }).subscribe({
            next: (newH) => callback(newH.id),
            error: () => alert('No se pudo crear la ficha clínica.')
          });
        }
      },
      error: () => {
        this.http.post<any>('/historial', { mascotaId }).subscribe({
          next: (newH) => callback(newH.id),
          error: () => alert('No se pudo crear la ficha clínica.')
        });
      }
    });
  }

  recargarHistorialMascota(mascota: any): void {
    this.http.get<any>(`/historial/mascota/${mascota.id}`).subscribe({
      next: (h) => {
        mascota.historial = h;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEstadoEnfermedad(mascota: any, enfermedad: any): void {
    const nuevaFechaAlta = enfermedad.fecha_alta ? null : new Date();
    
    this.http.patch<any>(`/enfermedades/${enfermedad.id}`, { fecha_alta: nuevaFechaAlta }).subscribe({
      next: () => {
        this.recargarHistorialMascota(mascota);
      },
      error: () => alert('Error al cambiar el estado de la enfermedad.')
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_nombre');
    this.router.navigate(['/login']);
  }
}
