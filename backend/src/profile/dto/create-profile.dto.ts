import { IsString, IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  nombre: string;

  @IsString()
  disciplina: string;

  @IsNumber()
  @Min(40)
  @Max(200)
  pesoActual: number;

  @IsNumber()
  @Min(40)
  @Max(200)
  pesoObjetivo: number;

  @IsDateString()
  fechaCompetencia: string;

  @IsString()
  experiencia: string;

  @IsOptional()
  @IsDateString()
  fechaCreacion?: string;
}