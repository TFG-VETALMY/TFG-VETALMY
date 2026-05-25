import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { UnreadMessagesService } from '../../services/unread-messages.service';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, DatePickerModule, InputTextModule, ButtonModule],
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

  mostrarAsistenteCita = false;
  activeChatObj: any = null;
  mascotasDisponibles: any[] = [];
  
  tiposCita = [
    { label: 'Consulta General', value: 'Consulta' },
    { label: 'Revisión de Control', value: 'Revisión' },
    { label: 'Vacunación', value: 'Vacunación' },
    { label: 'Urgencia Médica', value: 'Urgencia' }
  ];

  citaForm: {
    mascotaId: any;
    fechaHora: Date | null;
    tipo: string;
    motivo: string;
  } = {
    mascotaId: null,
    fechaHora: null,
    tipo: 'Consulta',
    motivo: ''
  };

  get miInicial(): string {
    const nombre = localStorage.getItem('user_nombre') || 'U';
    return nombre.charAt(0).toUpperCase();
  }

  get contactoInicial(): string {
    return this.contactoActual ? this.contactoActual.charAt(0).toUpperCase() : '?';
  }

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private unreadSvc: UnreadMessagesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // Al entrar en el chat, reseteamos el contador de mensajes sin leer
    this.unreadSvc.resetUnread();

    this.rol = localStorage.getItem('user_role');
    const token = localStorage.getItem('token');
    const idStr = localStorage.getItem('user_id');
    this.userId = idStr ? parseInt(idStr, 10) : 0;

    this.socket = io(environment.wsUrl, {
      auth: { token: token, userId: this.userId }
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de WebSockets con ID:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
    });

    // cada que recibe un mensaje lo mete a la lista de mensajes 
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

        // escuchador de cambios en la vista
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
    //aqui se usa get para obtener todos los usuarios y se filtra por rol veterinario
    this.http.get<any[]>('/usuarios').subscribe({
      next: (usuarios) => {
        this.veterinarios = usuarios.filter(u => u.rol === 'veterinario');
        
        // Cargar automáticamente el chat del primer veterinario si no hay ninguno seleccionado
        if (this.veterinarios.length > 0 && this.chatId === 0) {
          this.iniciarChatConVeterinario(this.veterinarios[0]);
        }
        
        this.cdr.detectChanges();
      }
    });
  }

  cargarMisChats() {
    //aqui se usa get para obtener todos los chats y se filtra por el id del veterinario
    this.http.get<any[]>('/chat').subscribe({
      next: (chats) => {
        this.chatsActivos = chats.filter(c =>
          c.veterinarioId === this.userId ||
          (c.veterinario && c.veterinario.id === this.userId)
        );

        // Cargar automáticamente el primer chat activo si no hay ninguno seleccionado
        if (this.chatsActivos.length > 0 && this.chatId === 0) {
          this.abrirChatExistente(this.chatsActivos[0]);
        }

        this.cdr.detectChanges();
      }
    });
  }

  iniciarChatConVeterinario(vet: any) {
    //aqui se inicia el chat con el veterinario y si no existe se crea
    this.contactoActual = vet.nombre;
    this.mensajes = [];

    //aqui se busca el chat existente con el veterinario y si no existe se crea
    this.http.get<any[]>('/chat').subscribe({
      next: (chats) => {
        const chatExistente = chats.find(c =>
          (c.clienteId === this.userId || c.cliente?.id === this.userId) &&
          (c.veterinarioId === vet.id || c.veterinario?.id === vet.id)
        );

        if (chatExistente) {
          this.activeChatObj = chatExistente;
          this.abrirChat(chatExistente.id, chatExistente.mensajes);
        } else {
          const nuevoChat = { clienteId: this.userId, veterinarioId: vet.id };
          this.http.post<any>('/chat', nuevoChat).subscribe({
            next: (chat) => {
              this.activeChatObj = chat;
              this.abrirChat(chat.id, []);
            }
          });
        }
      }
    });
  }

  abrirChatExistente(chat: any) {
    //aqui se abre el chat 
    this.contactoActual = chat.cliente?.nombre || 'Cliente';
    this.mensajes = [];
    this.activeChatObj = chat;
    this.abrirChat(chat.id, chat.mensajes);
  }

  abrirChat(id: number, mensajes: any[]) {
    //aqui se abre el chat y se cargan los mensajes y al final hace un detectChanges para que se muestren
    this.chatId = id;
    this.mensajes = mensajes || [];
    // Notificamos al servicio cuál es el chat activo para no contar sus mensajes
    this.unreadSvc.setActiveChat(id);
    this.cdr.detectChanges();
  }

  enviarMensaje() {
    //aqui se envia el mensaje y al final se muestran todos los mensajes
    if (this.nuevoMensaje.trim() !== '' && this.chatId !== 0) {
      const payload = {
        mensaje: this.nuevoMensaje,
        chatId: this.chatId,
        usuarioId: this.userId
      };

      // aqui se agregan los nuevos mensajes a la lista de mensajes que tiene que pintarse
      this.mensajes.push({
        ...payload,
        fecha_creacion: new Date().toISOString()
      });

      // aqui se envia el mensaje al servidor
      this.socket.emit('enviar-mensaje', payload);
      // limpiamos el input para volver a enviar otro mensaje sin colapso 
      this.nuevoMensaje = '';

      //aqui se muestra el mensaje en la pantalla de manera inmediata
      setTimeout(() => this.cdr.detectChanges(), 50);
    }
  }

  onMensajeChange(valor: string) {
    if (valor.toLowerCase().includes('@cita')) {
      // Eliminar el '@cita' del input para que no se envíe como mensaje plano
      this.nuevoMensaje = valor.replace(/@cita/gi, '').trim();
      this.abrirAsistenteCita();
    }
  }

  abrirAsistenteCita() {
    if (!this.activeChatObj) return;
    
    const clienteId = this.activeChatObj.clienteId || this.activeChatObj.cliente?.id;
    if (!clienteId) return;

    this.http.get<any[]>('/mascotas').subscribe({
      next: (mascotas) => {
        this.mascotasDisponibles = mascotas.filter(m => m.usuarioId === clienteId || m.usuario?.id === clienteId).map(m => ({
          ...m,
          displayName: `${m.nombre} (${m.animal})`
        }));
        this.mostrarAsistenteCita = true;
        
        // Pre-seleccionar la primera mascota si hay disponibles
        if (this.mascotasDisponibles.length > 0) {
          this.citaForm.mascotaId = this.mascotasDisponibles[0].id;
        }
        this.cdr.detectChanges();
      }
    });
  }

  agendarCita() {
    if (!this.citaForm.mascotaId) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Por favor seleccione la mascota.' });
      return;
    }
    if (!this.citaForm.fechaHora) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Por favor seleccione la fecha y hora de la cita.' });
      return;
    }

    const motivoFinal = this.citaForm.motivo.trim() || 'Consulta programada vía Chat';

    const mascota = this.mascotasDisponibles.find(m => m.id === this.citaForm.mascotaId);
    const nombreMascota = mascota ? mascota.nombre : 'la mascota';
    
    const payloadCita = {
      fecha: this.citaForm.fechaHora,
      tipo: this.citaForm.tipo,
      estado: 'PROGRAMADA',
      motivo: motivoFinal,
      mascotaId: this.citaForm.mascotaId,
      clienteId: this.activeChatObj.clienteId || this.activeChatObj.cliente?.id,
      veterinarioId: this.activeChatObj.veterinarioId || this.activeChatObj.veterinario?.id
    };

    this.http.post<any>('/citas', payloadCita).subscribe({
      next: () => {
        // Enviar un mensaje al chat notificando que la cita ha sido agendada
        const fechaFormateada = this.citaForm.fechaHora!.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        const textoMensaje = `📅 [ASISTENTE] ¡Se ha agendado una cita! \n🐾 Mascota: ${nombreMascota} \n🩺 Tipo: ${this.citaForm.tipo} \n⏰ Fecha y Hora: ${fechaFormateada} \n📝 Motivo: ${motivoFinal}`;
        
        const payloadMensaje = {
          mensaje: textoMensaje,
          chatId: this.chatId,
          usuarioId: this.userId
        };

        this.mensajes.push({
          ...payloadMensaje,
          fecha_creacion: new Date().toISOString()
        });

        this.socket.emit('enviar-mensaje', payloadMensaje);
        
        // Cerrar el asistente y resetear formulario
        this.mostrarAsistenteCita = false;
        this.citaForm = {
          mascotaId: null,
          fechaHora: null,
          tipo: 'Consulta',
          motivo: ''
        };
        this.cdr.detectChanges();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la cita.' })
    });
  }

  //aqui se cierra la conexion con el servidor al cerrar la pagina web
  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}