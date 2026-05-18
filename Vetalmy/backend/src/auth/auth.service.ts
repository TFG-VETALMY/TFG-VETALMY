import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../modules/usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
    ) { }

    async register(signupData: any) {
        const user = await this.usuariosService.create(signupData);
        const payload = { sub: user.id, email: user.email, rol: user.rol };
        return { token: this.jwtService.sign(payload) };
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usuariosService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.contrasenia)) {
            const { contrasenia, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email, rol: user.rol };
        return { 
            token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, rol: user.rol, nombre: user.nombre, foto: user.foto ?? '' }
        };
    }

    async loginWithGoogle(googleUser: { email: string; nombre: string; apellido1: string; foto: string }) {
        let user = await this.usuariosService.findByEmail(googleUser.email);

        if (!user) {
            user = await this.usuariosService.create({
                email: googleUser.email,
                nombre: googleUser.nombre,
                apellido1: googleUser.apellido1 || '',
                contrasenia: Math.random().toString(36).slice(-12) + '!Gx9',
                rol: 'user',
                foto: googleUser.foto,
            });
        } else if (googleUser.foto && !user.foto) {
            // Actualizar la foto si aun no la tiene guardada
            await this.usuariosService.update(user.id, { foto: googleUser.foto });
            user.foto = googleUser.foto;
        }

        const payload = { sub: user.id, email: user.email, rol: user.rol };
        return {
            token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, rol: user.rol, nombre: user.nombre, foto: user.foto ?? '' }
        };
    }
}
