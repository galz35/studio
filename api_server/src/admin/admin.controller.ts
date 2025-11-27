import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CrearUsuarioDto, Rol } from './dto/crear-usuario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Obtener KPIs del dashboard de admin' })
    getDashboard(@Request() req) {
        return this.adminService.getDashboardStats(req.user.pais);
    }

    @Post('usuarios')
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    crearUsuario(@Body() crearUsuarioDto: CrearUsuarioDto) {
        return this.adminService.crearUsuario(crearUsuarioDto);
    }

    @Get('usuarios')
    @ApiOperation({ summary: 'Listar usuarios del país' })
    getUsuarios(@Request() req) {
        return this.adminService.getUsuarios(req.user.pais);
    }

    @Get('medicos')
    @ApiOperation({ summary: 'Listar médicos del país' })
    getMedicos(@Request() req) {
        return this.adminService.getMedicos(req.user.pais);
    }
}
