import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MensajesService } from '../mensajes.service';
import { CreateMensajeDto } from '../dto/create-mensaje.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly mensajesService: MensajesService) { }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;
    if (userId) {
      client.join(`user_${userId}`);
      console.log(`Cliente conectado: ${client.id}, sala: user_${userId}`);
    } else {
      console.log('Cliente conectado:', client.id);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id);
  }

  @SubscribeMessage('enviar-mensaje')
  async handleMessage(@MessageBody() createMensajeDto: CreateMensajeDto) {
    const mensajeGuardado = await this.mensajesService.create(createMensajeDto);
    
    if (mensajeGuardado && mensajeGuardado.chat) {
      this.server.to(`user_${mensajeGuardado.chat.veterinarioId}`).to(`user_${mensajeGuardado.chat.clienteId}`).emit('nuevo-mensaje', mensajeGuardado);
    } else if (mensajeGuardado) {
      this.server.emit('nuevo-mensaje', mensajeGuardado);
    }
    
    return mensajeGuardado;
  }
}