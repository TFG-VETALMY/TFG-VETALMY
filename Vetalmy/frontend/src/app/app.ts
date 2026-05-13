import { Component, signal, OnInit, NgZone } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Menu } from './components/menu/menu';
import { Footer } from './components/footer/footer';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Footer, CommonModule, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  private socket!: Socket;

  constructor(
    public router: Router,
    private messageService: MessageService,
    private ngZone: NgZone
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!this.socket && localStorage.getItem('token')) {
          this.conectarSocket();
        }
      }
    });
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.conectarSocket();
    }
  }



  conectarSocket() {
    if (this.socket) return;

    const token = localStorage.getItem('token');
    this.socket = io(environment.wsUrl, {
      auth: { token: token }
    });

    this.socket.on('nuevo-mensaje', (mensaje) => {
      this.ngZone.run(() => {
        const userId = Number(localStorage.getItem('user_id'));
        if (mensaje.usuarioId !== userId && !this.router.url.includes('/chat')) {
          const remitente = mensaje.usuario;
          const nombre = remitente ? remitente.nombre : 'Desconocido';
          const rol = remitente?.rol === 'veterinario' ? 'Veterinario' : 'Cliente';

          this.messageService.add({
            severity: 'info',
            summary: `Nuevo mensaje de: ${nombre} (${rol})`,
            detail: mensaje.mensaje || 'Tienes un nuevo mensaje en el chat.',
            life: 5000
          });
        }
      });
    });
  }
}
