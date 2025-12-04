import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión de usuario' })
    @ApiResponse({ status: 200, description: 'Login exitoso, devuelve JWT.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @Post('seed')
    @ApiOperation({ summary: 'Crear usuario ADMIN inicial (Solo si la BD está vacía)' })
    createInitialAdmin() {
        return this.authService.createInitialAdmin();
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Perfil del usuario.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    getProfile(@Request() req) {
        return this.authService.getProfile(req.user.idUsuario);
    }
}
