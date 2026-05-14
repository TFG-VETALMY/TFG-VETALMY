import { Controller, Get, Post, Body, UnauthorizedException, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

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

    // 🌐 GOOGLE — Redirige a la pantalla de Google
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Passport redirige automáticamente a Google
    }

    // 🌐 GOOGLE — Callback después de que Google autoriza
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req: any, @Res() res: any) {
        const result = await this.authService.loginWithGoogle(req.user);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
        const params = new URLSearchParams({
            token: result.token,
            id: String(result.user.id),
            nombre: result.user.nombre ?? '',
            rol: result.user.rol ?? 'user',
            email: result.user.email ?? '',
            foto: result.user.foto ?? '',
        });

        return res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    }
}