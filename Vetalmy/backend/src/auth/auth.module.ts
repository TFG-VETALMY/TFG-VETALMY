import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../modules/usuarios/usuarios.module';
import { UsuariosService } from '../modules/usuarios/usuarios.service';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'PALABRA_SECRETA_GALACTICA',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, GoogleStrategy, UsuariosService],
  exports: [JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule { }
