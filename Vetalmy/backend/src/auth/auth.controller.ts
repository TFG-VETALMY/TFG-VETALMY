import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // 🚪 ENDPOINT DE REGISTRO
    @Post('register')
    async register(@Body() signupData: any) {
        return this.authService.register(signupData);
    }

    // 🔑 ENDPOINT DE LOGIN
    @Post('login')
    async login(@Body() loginData: any) {
        const user = await this.authService.validateUser(loginData.email, loginData.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales galácticas incorrectas');
        }
        return this.authService.login(user);
    }
}