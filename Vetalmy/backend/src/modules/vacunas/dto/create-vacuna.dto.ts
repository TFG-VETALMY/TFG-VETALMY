import { IsInt, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateVacunaDto {
    @IsString()
    nombre: string;

    @IsString()
    @IsOptional()
    descripción?: string;

    @IsString()
    @IsOptional()
    periodicidad?: string;

    @IsInt()
    historialId: number;

    @IsDateString()
    fecha_aplicacion: string;
}