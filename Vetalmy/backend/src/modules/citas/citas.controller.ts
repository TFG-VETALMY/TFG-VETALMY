import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Controller('citas')
@UseGuards(JwtAuthGuard)
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  create(@Body() createCitaDto: CreateCitaDto, @Req() req) {
    if (req.user.rol !== 'veterinario' && req.user.rol !== 'admin') {
      createCitaDto.clienteId = req.user.id;
    }
    return this.citasService.create(createCitaDto);
  }

  @Get()
  async findAll(@Req() req) {
    const allCitas = await this.citasService.findAll();
    if (req.user.rol === 'admin') return allCitas;
    if (req.user.rol === 'veterinario') {
      return allCitas.filter(c => !c.veterinario || c.veterinario.id === req.user.id);
    }
    return allCitas.filter(c => c.cliente?.id === req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const cita = await this.citasService.findOne(+id);
    if (!cita) return null;
    if (req.user.rol === 'admin') return cita;
    if (req.user.rol === 'veterinario' && (!cita.veterinario || cita.veterinario.id === req.user.id)) return cita;
    if (cita.cliente?.id === req.user.id) return cita;
    return null;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(+id, updateCitaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citasService.remove(+id);
  }
}
