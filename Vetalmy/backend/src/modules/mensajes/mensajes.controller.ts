import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MensajesService } from './mensajes.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';


@Controller('mensajes')
@UseGuards(JwtAuthGuard)
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) { }

  @Post()
  create(@Body() createMensajeDto: CreateMensajeDto) {
    return this.mensajesService.create(createMensajeDto);
  }

  @Get()
  findAll() {
    return this.mensajesService.findAll();
  }
}