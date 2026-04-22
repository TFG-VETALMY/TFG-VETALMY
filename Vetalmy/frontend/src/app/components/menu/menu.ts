import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true, // Asumo que es standalone por los imports directos
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  isMenuOpen: boolean = false;

  // Inyectamos ElementRef para poder referenciar el propio componente
  constructor(private router: Router, private eRef: ElementRef) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Este decorador escucha clics en todo el documento
  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    // Si el menú está abierto y el clic NO fue dentro del componente
    if (this.isMenuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    this.isMenuOpen = false; // Cerramos menú por seguridad antes de irnos
    this.router.navigate(['/login']);
  }
}