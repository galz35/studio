import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { SeguimientoService } from './seguimiento.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';

@ApiTags('seguimientos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('seguimientos')
export class SeguimientoController {
    constructor(private readonly seguimientoService: SeguimientoService) { }

    @Post()
    create(@Body() createSeguimientoDto: CreateSeguimientoDto) {
        return this.seguimientoService.create(createSeguimientoDto);
    }

    @Get()
    findAll() {
        return this.seguimientoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.seguimientoService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSeguimientoDto: any) {
        return this.seguimientoService.update(+id, updateSeguimientoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.seguimientoService.remove(+id);
    }
}
