import { PartialType } from '@nestjs/mapped-types';
import { CreateVacunaDto } from './create-vacuna.dto';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateVacunaDto extends PartialType(CreateVacunaDto) {
    @IsString()
    nombre: string;

    @IsString()
    @IsOptional()
    descripción?: string;

    @IsString()
    @IsOptional()
    periodicidad?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fecha_aplicacion?: Date;
}
