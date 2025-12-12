import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEvaluacionDto {
    @ApiProperty({ description: 'ID del paciente que realiza la evaluación' })
    @IsNumber()
    @IsNotEmpty()
    idPaciente: number;

    @ApiProperty({ description: 'Nivel de estrés percibido (Bajo, Medio, Alto)' })
    @IsString()
    @IsOptional()
    nivelEstres: string;

    @ApiProperty({ description: 'Lista de síntomas referidos (ej: Ansiedad, Insomnio)' })
    @IsArray()
    @IsOptional()
    sintomas: string[];

    @ApiProperty({ description: 'Narrativa del paciente sobre cómo se siente' })
    @IsString()
    @IsNotEmpty()
    narrativa: string;

    @ApiProperty({ description: 'ID del médico si está asignado (opcional)', required: false })
    @IsNumber()
    @IsOptional()
    idMedico?: number;
}
