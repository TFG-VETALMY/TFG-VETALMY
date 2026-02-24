import { IsInt, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

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

    @IsDate()
    @Type(() => Date)
    fecha_aplicacion: Date;
}