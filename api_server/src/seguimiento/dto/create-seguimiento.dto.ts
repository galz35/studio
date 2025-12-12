import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateSeguimientoDto {
    @IsNumber()
    @IsNotEmpty()
    idCaso: number;

    @IsNumber()
    @IsNotEmpty()
    idPaciente: number;

    @IsNumber()
    @IsNotEmpty()
    idUsuarioResponsable: number; // ID of the Medico/Admin responsible

    @IsNumber()
    @IsOptional()
    idAtencionOrigen: number; // Linked attention

    @IsDateString()
    @IsNotEmpty()
    fechaProgramada: string;

    @IsString()
    @IsNotEmpty()
    tipoSeguimiento: string; // e.g., 'Telefonico', 'Presencial'

    @IsString()
    @IsOptional()
    notasObjetivo: string;

    @IsEnum(['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'])
    @IsOptional()
    estadoSeguimiento: string;
}
