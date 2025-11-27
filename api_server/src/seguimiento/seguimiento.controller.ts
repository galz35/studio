import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SeguimientoService } from 'src/seguimiento/seguimiento.service';
import { Seguimiento } from '../entities/seguimiento.entity';

@Controller('seguimientos')
export class SeguimientoController {
    constructor(private readonly seguimientoService: SeguimientoService) { }

    @Post()
    create(@Body() createSeguimientoDto: any) {
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
