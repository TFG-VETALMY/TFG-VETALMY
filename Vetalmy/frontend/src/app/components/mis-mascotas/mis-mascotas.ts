import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule, UpperCasePipe } from '@angular/common';

export interface Mascota {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  especie: 'Perro' | 'Gato' | 'Otro';
  foto: string;
}

@Component({
  selector: 'app-mis-mascotas',
  imports: [ButtonModule, MenuModule, CommonModule, UpperCasePipe],
  templateUrl: './mis-mascotas.html',
  styleUrl: './mis-mascotas.css',
})
export class MisMascotas {

  mascotas: Mascota[] = [];
  recordatorio: string = '';
  opcionesMenu: MenuItem[] = [];

  ngOnInit(): void {
    // ── Datos de ejemplo (sustituir por llamada al servicio/API) ──
    this.mascotas = [
      {
        id: 1,
        nombre: 'Luna',
        raza: 'Golden Retriever',
        edad: 4,
        especie: 'Perro',
        foto: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=300&h=300&fit=crop'
      },
      {
        id: 2,
        nombre: 'Simba',
        raza: 'Maine Coon',
        edad: 2,
        especie: 'Gato',
        foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop'
      },
      {
        id: 3,
        nombre: 'Max',
        raza: 'Bulldog Francés',
        edad: 1,
        especie: 'Perro',
        foto: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=300&h=300&fit=crop'
      }
    ];

    // Recordatorio de ejemplo
    this.recordatorio = 'Luna tiene pendiente su vacunación anual para el próximo 15 de Mayo.';

    // Menú contextual de cada tarjeta
    this.opcionesMenu = [
      { label: 'Ver perfil', icon: 'pi pi-user' },
      { label: 'Historial médico', icon: 'pi pi-file' },
      { separator: true },
      { label: 'Eliminar mascota', icon: 'pi pi-trash', styleClass: 'menu-item-danger' }
    ];
  }

  verPerfil(mascota: Mascota): void {
    // Navegar a la página de perfil: this.router.navigate(['/mascotas', mascota.id])
    console.log('Ver perfil de:', mascota.nombre);
  }

  verHistorial(mascota: Mascota): void {
    // Navegar al historial: this.router.navigate(['/mascotas', mascota.id, 'historial'])
    console.log('Ver historial de:', mascota.nombre);
  }

  registrarNueva(): void {
    // Abrir diálogo o navegar al formulario de registro
    console.log('Registrar nueva mascota');
  }
}

