import { IsString, IsInt, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCitaDto {
    @IsDate()
    @Type(() => Date)
    fecha: Date;

    @IsString()
    @IsOptional()
    tipo?: string;

    @IsString()
    motivo: string;

    @IsInt()
    mascotaId: number;

    @IsInt()
    clienteId: number;
}