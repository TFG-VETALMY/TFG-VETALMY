import { Injectable } from '@nestjs/common';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MensajesService {
  constructor(
    @InjectRepository(Mensaje)
    private readonly mensajeRepository: Repository<Mensaje>,
  ) { }

  async create(createMensajeDto: CreateMensajeDto) {
    const mensaje = this.mensajeRepository.create({
      mensaje: createMensajeDto.mensaje,
      chatId: createMensajeDto.chatId,
      usuarioId: createMensajeDto.usuarioId
    });
    const saved = await this.mensajeRepository.save(mensaje);
    return await this.mensajeRepository.findOne({
      where: { id: saved.id },
      relations: ['usuario']
    });
  }

  async findAll() {
    return await this.mensajeRepository.find({
      relations: ['chat', 'usuario'],
      order: { fecha: 'ASC' }
    });
  }
}