import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Test } from '../test/test';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CommonModule, Test],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent implements OnInit {

  // Para el test de animales
  mostrarTest: boolean = false;
  
  scrollToTest() {
    document.getElementById('seccion-test')?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleTest() {
    this.mostrarTest = !this.mostrarTest;
  }

  mostrarCookies = false;

  get rutaCitas(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') ? '/citas' : '/login';
    }
    return '/login';
  }

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const cookiesAceptadas = localStorage.getItem('cookies_aceptadas');
      if (!cookiesAceptadas) {
        this.mostrarCookies = true;
        this.cdr.detectChanges();
      }
    }
  }

  aceptarCookies() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookies_aceptadas', 'true');
    }
    this.mostrarCookies = false;
    this.cdr.detectChanges();
  }

  rechazarCookies() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookies_aceptadas', 'rechazadas');
    }
    this.mostrarCookies = false;
    this.cdr.detectChanges();
  }
}