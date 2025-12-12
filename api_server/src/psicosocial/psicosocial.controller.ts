import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PsicosocialService } from './psicosocial.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('psicosocial')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('psicosocial')
export class PsicosocialController {
    constructor(private readonly service: PsicosocialService) { }

    @Post()
    @ApiOperation({ summary: 'Registrar nueva evaluación psicosocial con análisis de IA' })
    create(@Body() dto: CreateEvaluacionDto) {
        return this.service.registrarEvaluacion(dto);
    }

    @Get('paciente/:id')
    @ApiOperation({ summary: 'Obtener historial psicosocial de un paciente' })
    getByPaciente(@Param('id') id: string) {
        return this.service.getPorPaciente(+id);
    }
}
