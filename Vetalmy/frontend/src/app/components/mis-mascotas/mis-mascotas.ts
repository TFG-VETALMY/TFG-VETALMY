import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';

export interface Usuario {
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email: string;
  rol: string;
}

export interface Mascota {
  id: number;
  nombre: string;
  animal: string;
  raza: string;
  edad: number;
  peso: number;
  usuarioId: number;
  usuario?: Usuario;
}

export interface ClienteConMascotas {
  usuario: Usuario;
  mascotas: Mascota[];
}

@Component({
  selector: 'app-mis-mascotas',
  imports: [
    ButtonModule, MenuModule, CommonModule, UpperCasePipe,
    DialogModule, InputTextModule, InputNumberModule,
    FormsModule, ToastModule, ConfirmDialogModule, SelectModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mis-mascotas.html',
  styleUrl: './mis-mascotas.css',
})
export class MisMascotas implements OnInit {

  esVeterinario = false;
  userId = 0;

  // Modo usuario — solo sus mascotas
  mascotas: Mascota[] = [];

  // Modo veterinario — todos los clientes con sus mascotas
  clientesFiltrados: ClienteConMascotas[] = [];
  clientesOriginales: ClienteConMascotas[] = [];
  busqueda = '';
  clienteExpandido: number | null = null;
  mostrarTodos = false;
  readonly LIMITE = 4;

  get clientesVisibles(): ClienteConMascotas[] {
    return this.mostrarTodos ? this.clientesFiltrados : this.clientesFiltrados.slice(0, this.LIMITE);
  }

  // Diálogo
  dialogVisible = false;
  editando = false;
  mascotaSeleccionada: Mascota | null = null;
  form: Partial<Mascota> = {};
  usuarioIdParaNueva: number | null = null;

  animalesOpciones = [
    { label: 'Perro', value: 'Perro' },
    { label: 'Gato', value: 'Gato' },
    { label: 'Ave', value: 'Ave' },
    { label: 'Conejo', value: 'Conejo' },
    { label: 'Otro', value: 'Otro' },
  ];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.esVeterinario = localStorage.getItem('user_role') === 'veterinario';
    this.userId = Number(localStorage.getItem('user_id'));

    if (this.esVeterinario) {
      this.cargarTodos();
    } else {
      this.cargarMisMascotas();
    }
  }

  // ─── MODO USUARIO ─────────────────────────────────────────────────

  cargarMisMascotas(): void {
    this.http.get<Mascota[]>('/mascotas').subscribe({
      next: (todas) => {
        this.mascotas = todas.filter(m => m.usuarioId === this.userId);
      },
      error: () => this.showError('No se pudieron cargar las mascotas.')
    });
  }

  // ─── MODO VETERINARIO ─────────────────────────────────────────────

  cargarTodos(): void {
    forkJoin({
      mascotas: this.http.get<Mascota[]>('/mascotas'),
      usuarios: this.http.get<Usuario[]>('/usuarios')
    }).subscribe({
      next: ({ mascotas, usuarios }) => {
        const mapa = new Map<number, ClienteConMascotas>();

        // Primero registrar todos los clientes (sin mascotas)
        for (const u of usuarios) {
          if (u.rol === 'veterinario') continue;
          mapa.set(u.id, { usuario: u, mascotas: [] });
        }

        // Luego añadir las mascotas a su cliente
        for (const m of mascotas) {
          if (!m.usuario || m.usuario.rol === 'veterinario') continue;
          if (mapa.has(m.usuarioId)) {
            mapa.get(m.usuarioId)!.mascotas.push(m);
          }
        }

        this.clientesOriginales = Array.from(mapa.values())
          .sort((a, b) => a.usuario.nombre.localeCompare(b.usuario.nombre));
        this.clientesFiltrados = [...this.clientesOriginales];
      },
      error: () => this.showError('No se pudieron cargar los datos.')
    });
  }

  filtrarClientes(): void {
    const q = this.busqueda.toLowerCase().trim();
    if (!q) {
      this.clientesFiltrados = [...this.clientesOriginales];
      return;
    }
    this.clientesFiltrados = q
      ? this.clientesOriginales.filter(c => {
          const nombre = `${c.usuario.nombre} ${c.usuario.apellido1 ?? ''}`.toLowerCase();
          return nombre.includes(q);
        })
      : [...this.clientesOriginales];
    this.mostrarTodos = false; // reset al filtrar
  }

  toggleCliente(userId: number): void {
    this.clienteExpandido = this.clienteExpandido === userId ? null : userId;
  }

  // ─── CRUD COMPARTIDO ──────────────────────────────────────────────

  registrarNueva(usuarioId?: number): void {
    this.editando = false;
    this.form = { animal: 'Perro' };
    this.usuarioIdParaNueva = usuarioId ?? this.userId;
    this.dialogVisible = true;
  }

  abrirEdicion(mascota: Mascota): void {
    this.editando = true;
    this.mascotaSeleccionada = mascota;
    this.form = { ...mascota };
    this.dialogVisible = true;
  }

  guardar(): void {
    const payload = { ...this.form, usuarioId: this.usuarioIdParaNueva ?? this.userId };

    if (this.editando && this.mascotaSeleccionada) {
      this.http.patch<Mascota>(`/mascotas/${this.mascotaSeleccionada.id}`, payload).subscribe({
        next: () => {
          this.showExito(`${this.form.nombre} actualizada.`);
          this.dialogVisible = false;
          this.recargar();
        },
        error: () => this.showError('No se pudo actualizar.')
      });
    } else {
      this.http.post<Mascota>('/mascotas', payload).subscribe({
        next: () => {
          this.showExito(`${this.form.nombre} registrada.`);
          this.dialogVisible = false;
          this.recargar();
        },
        error: () => this.showError('No se pudo registrar.')
      });
    }
  }

  confirmarEliminar(mascota: Mascota): void {
    this.confirmationService.confirm({
      message: `¿Eliminar a <strong>${mascota.nombre}</strong>? Esta acción no se puede deshacer.`,
      header: 'Eliminar mascota',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminar(mascota)
    });
  }

  eliminar(mascota: Mascota): void {
    this.http.delete(`/mascotas/${mascota.id}`).subscribe({
      next: () => {
        this.showExito(`${mascota.nombre} eliminada.`);
        this.recargar();
      },
      error: () => this.showError('No se pudo eliminar.')
    });
  }

  recargar(): void {
    if (this.esVeterinario) this.cargarTodos();
    else this.cargarMisMascotas();
  }

  getMenuOpciones(mascota: Mascota): MenuItem[] {
    return [
      { label: 'Editar', icon: 'pi pi-pencil', command: () => this.abrirEdicion(mascota) },
      { separator: true },
      { label: 'Eliminar', icon: 'pi pi-trash', styleClass: 'menu-item-danger', command: () => this.confirmarEliminar(mascota) }
    ];
  }

  getIconoAnimal(animal: string): string {
    const iconos: Record<string, string> = {
      'Perro': '🐶', 'Gato': '🐱', 'Ave': '🐦', 'Conejo': '🐰', 'Otro': '🐾'
    };
    return iconos[animal] ?? '🐾';
  }

  getNombreCompleto(u: Usuario): string {
    return [u.nombre, u.apellido1, u.apellido2].filter(Boolean).join(' ');
  }

  private showExito(msg: string) {
    this.messageService.add({ severity: 'success', summary: '¡Listo!', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
}
