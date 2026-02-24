import { PartialType } from '@nestjs/mapped-types';
import { CreateCitaDto } from './create-cita.dto';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateCitaDto extends PartialType(CreateCitaDto) {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    @IsOptional()
    tipo?: string;

    @IsString()
    @IsOptional()
    motivo?: string;

    @IsNumber()
    @IsOptional()
    mascotaId?: number;

    @IsNumber()
    @IsOptional()
    clienteId?: number;

    @IsNumber()
    @IsOptional()
    veterinarioId?: number;
}
