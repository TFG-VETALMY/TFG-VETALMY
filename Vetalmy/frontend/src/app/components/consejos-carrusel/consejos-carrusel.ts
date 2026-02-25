import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consejos-carrusel',
  standalone: true,
  imports: [CarouselModule, ButtonModule, DialogModule, CommonModule],
  templateUrl: './consejos-carrusel.html',
  styleUrl: './consejos-carrusel.css'
})
export class ConsejosCarruselComponent implements OnInit {
  consejos: any[] = [];
  responsiveOptions: any[] | undefined;

  // Variables para el Dialog
  displayDialog: boolean = false;
  consejoSeleccionado: any = null;

  ngOnInit() {
    this.consejos = [
      {
        titulo: 'Alimentación Saludable',
        imagen: 'perro-comiendo-de-mano.jpeg',
        detalle: 'Una dieta equilibrada es la base de una vida larga. Asegúrate de elegir piensos de alta calidad y evitar alimentos prohibidos como el chocolate o la cebolla.'
      },
      {
        titulo: 'Higiene Dental',
        imagen: 'perro-cepillo-dientes.webp',
        detalle: 'El cepillado regular previene el sarro y enfermedades periodontales. Existen snacks dentales que ayudan, pero nada sustituye al cepillado semanal.'
      },

    ];

    this.responsiveOptions = [
      { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
      { breakpoint: '991px', numVisible: 2, numScroll: 1 },
      { breakpoint: '767px', numVisible: 1, numScroll: 1 }
    ];
  }

  // Función para abrir el diálogo
  mostrarDetalle(consejo: any) {
    this.consejoSeleccionado = consejo;
    this.displayDialog = true;
  }
}