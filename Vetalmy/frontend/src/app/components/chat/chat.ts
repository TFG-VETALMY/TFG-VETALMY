import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {

  private socket!: Socket;
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  rol: string | null = '';
  userId: number = 0;
  chatId: number = 0;
  veterinarios: any[] = [];
  chatsActivos: any[] = [];
  contactoActual: string = '';


  constructor(private http: HttpClient, private ngZone: NgZone, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.rol = localStorage.getItem('user_role');
    const token = localStorage.getItem('token');
    const idStr = localStorage.getItem('user_id');
    this.userId = idStr ? parseInt(idStr, 10) : 0;

    this.socket = io(environment.wsUrl, {
      auth: { token: token }
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de WebSockets con ID:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
    });

    this.socket.on('nuevo-mensaje', (mensaje) => {
      this.ngZone.run(() => {
        if (mensaje.chatId === this.chatId || mensaje.chat?.id === this.chatId) {
          const existe = this.mensajes.some(m => m.id === mensaje.id && mensaje.id !== undefined);
          if (!existe && mensaje.usuarioId !== this.userId) {
            this.mensajes.push(mensaje);
          }
        }

        if (this.rol === 'veterinario') {
          this.cargarMisChats();
        }

        this.cdr.detectChanges();
      });
    });

    if (this.rol === 'veterinario') {
      this.cargarMisChats();
    } else {
      this.cargarVeterinarios();
    }
  }

  cargarVeterinarios() {
    this.http.get<any[]>('/usuarios').subscribe({
      next: (usuarios) => {
        this.veterinarios = usuarios.filter(u => u.rol === 'veterinario');
        this.cdr.detectChanges();
      }
    });
  }

  cargarMisChats() {
    this.http.get<any[]>('/chat').subscribe({
      next: (chats) => {
        this.chatsActivos = chats.filter(c =>
          c.veterinarioId === this.userId ||
          (c.veterinario && c.veterinario.id === this.userId)
        );
        this.cdr.detectChanges();
      }
    });
  }

  iniciarChatConVeterinario(vet: any) {
    this.contactoActual = vet.nombre;
    this.mensajes = [];

    this.http.get<any[]>('/chat').subscribe({
      next: (chats) => {
        const chatExistente = chats.find(c =>
          (c.clienteId === this.userId || c.cliente?.id === this.userId) &&
          (c.veterinarioId === vet.id || c.veterinario?.id === vet.id)
        );

        if (chatExistente) {
          this.abrirChat(chatExistente.id, chatExistente.mensajes);
        } else {
          const nuevoChat = { clienteId: this.userId, veterinarioId: vet.id };
          this.http.post<any>('/chat', nuevoChat).subscribe({
            next: (chat) => this.abrirChat(chat.id, [])
          });
        }
      }
    });
  }

  abrirChatExistente(chat: any) {
    this.contactoActual = chat.cliente?.nombre || 'Cliente';
    this.mensajes = [];
    this.abrirChat(chat.id, chat.mensajes);
  }

  abrirChat(id: number, mensajes: any[]) {
    this.chatId = id;
    this.mensajes = mensajes || [];
    this.cdr.detectChanges();
  }

  enviarMensaje() {
    if (this.nuevoMensaje.trim() !== '' && this.chatId !== 0) {
      const payload = {
        mensaje: this.nuevoMensaje,
        chatId: this.chatId,
        usuarioId: this.userId
      };

      this.mensajes.push({
        ...payload,
        fecha_creacion: new Date().toISOString()
      });

      this.socket.emit('enviar-mensaje', payload);
      this.nuevoMensaje = '';

      setTimeout(() => this.cdr.detectChanges(), 50);
    }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}