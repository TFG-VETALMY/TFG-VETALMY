import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUsuarioDto {
    @IsString()
    @IsOptional()
    nombre?: string;

    @IsString()
    @IsOptional()
    apellido1?: string;

    @IsString()
    @IsOptional()
    apellido2?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    contrasenia?: string;

    @IsString()
    @IsOptional()
    rol?: string;
}