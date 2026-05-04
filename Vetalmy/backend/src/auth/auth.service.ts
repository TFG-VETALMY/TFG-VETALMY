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
        return { token: this.jwtService.sign(payload) };
    }
}
