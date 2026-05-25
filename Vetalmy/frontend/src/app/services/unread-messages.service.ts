import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UnreadMessagesService implements OnDestroy {

  /** Número de mensajes sin leer */
  private unreadCount = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCount.asObservable();

  private socket!: Socket;
  private userId: number = 0;
  /** ID del chat que el usuario tiene abierto actualmente (0 = ninguno) */
  private activeChatId: number = 0;

  init() {
    const token = localStorage.getItem('token');
    const idStr = localStorage.getItem('user_id');
    this.userId = idStr ? parseInt(idStr, 10) : 0;

    if (!token || !this.userId) return;

    // Evitamos crear múltiples sockets si ya está inicializado
    if (this.socket?.connected) return;

    this.socket = io(environment.wsUrl, { auth: { token, userId: this.userId } });

    this.socket.on('nuevo-mensaje', (mensaje: any) => {
      const chatId = mensaje.chatId ?? mensaje.chat?.id;
      const remitente = mensaje.usuarioId ?? mensaje.usuario?.id;

      // Solo contamos si el mensaje es de otro usuario y el chat NO está abierto
      if (remitente !== this.userId && chatId !== this.activeChatId) {
        this.unreadCount.next(this.unreadCount.value + 1);
      }
    });
  }

  /** Llamar desde el componente Chat cuando se abre un chat */
  setActiveChat(chatId: number) {
    this.activeChatId = chatId;
  }

  /** Llamar cuando el usuario entra a la sección de chat para resetear */
  resetUnread() {
    this.unreadCount.next(0);
    this.activeChatId = 0;
  }

  ngOnDestroy() {
    this.socket?.disconnect();
  }
}
