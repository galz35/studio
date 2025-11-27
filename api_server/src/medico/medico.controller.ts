import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { CrearAtencionDto } from './dto/crear-atencion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('medico')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MEDICO')
@Controller('medico')
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Obtener KPIs del dashboard de médico' })
    getDashboard(@Request() req) {
        return this.medicoService.getDashboardStats(req.user.idMedico, req.user.pais);
    }

    @Get('agenda-citas')
    @ApiOperation({ summary: 'Obtener casos abiertos para agendar' })
    getAgendaCitas(@Request() req) {
        return this.medicoService.getAgendaCitas(req.user.pais);
    }

    @Post('agenda-citas/agendar')
    @ApiOperation({ summary: 'Agendar una cita para un caso clínico' })
    agendarCita(@Body() agendarCitaDto: AgendarCitaDto) {
        return this.medicoService.agendarCita(agendarCitaDto);
    }

    @Post('atencion')
    @ApiOperation({ summary: 'Registrar atención médica' })
    crearAtencion(@Body() crearAtencionDto: CrearAtencionDto) {
        return this.medicoService.crearAtencion(crearAtencionDto);
    }
}
