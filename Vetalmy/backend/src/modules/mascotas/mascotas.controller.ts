import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Controller('mascotas')
@UseGuards(JwtAuthGuard)
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  create(@Body() createMascotaDto: CreateMascotaDto, @Req() req) {
    if (req.user.rol !== 'veterinario' && req.user.rol !== 'admin') {
      createMascotaDto.usuarioId = req.user.id;
    }
    return this.mascotasService.create(createMascotaDto);
  }

  @Get()
  async findAll(@Req() req) {
    const allMascotas = await this.mascotasService.findAll();
    if (req.user.rol === 'veterinario' || req.user.rol === 'admin') {
      return allMascotas;
    }
    return allMascotas.filter(m => m.usuarioId === req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const mascota = await this.mascotasService.findOne(+id);
    if (!mascota) return null;
    if (req.user.rol === 'veterinario' || req.user.rol === 'admin' || mascota.usuarioId === req.user.id) {
      return mascota;
    }
    return null;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMascotaDto: UpdateMascotaDto) {
    return this.mascotasService.update(+id, updateMascotaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mascotasService.remove(+id);
  }
}
