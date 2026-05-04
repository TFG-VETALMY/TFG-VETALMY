import { IsInt, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEnfermedadDto {
    @IsString()
    observaciones: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fecha_diagnostico?: Date;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fecha_alta?: Date;

    @IsInt()
    historialId: number;

    @IsInt()
    @IsOptional()
    veterinarioId?: number;
}