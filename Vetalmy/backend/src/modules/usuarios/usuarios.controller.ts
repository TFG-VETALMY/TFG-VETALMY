import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Post()
    create(@Body() body: CreateUsuarioDto) {
        return this.usuariosService.create(body);
    }

    @Get()
    obtenerTodos() {
        return this.usuariosService.findAll();
    }


    @Get(':id')
    obtenerPorId(@Param('id') id: string) {
        return this.usuariosService.findOne(+id);
    }

    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.usuariosService.remove(+id);
    }


    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
        return this.usuariosService.update(+id, updateUsuarioDto);
    }

    @Patch(':id/rol')
    updateRol(@Param('id') id: string, @Body() body: { rol: string }) {
        return this.usuariosService.updateRol(+id, body.rol);
    }

    @Patch(':id/contrasenia')
    updateContrasenia(@Param('id') id: string, @Body() body: { contrasenia: string }) {
        return this.usuariosService.updateContrasenia(+id, body.contrasenia);
    }


}