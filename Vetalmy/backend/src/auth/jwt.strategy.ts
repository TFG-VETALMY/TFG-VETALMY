import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'PALABRA_SECRETA_GALACTICA',
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, email: payload.email, rol: payload.rol };
    }


    private handleDBErrors(error: any): never {
        if (error.code === '23505') {
            throw new BadRequestException('Ya existe un usuario con ese email');
        }
        console.log(error);
        throw new InternalServerErrorException('Error al crear usuario (revisar logs)');
    }
}