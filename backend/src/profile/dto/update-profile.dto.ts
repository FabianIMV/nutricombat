import { IsString, IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  disciplina?: string;

  @IsOptional()
  @IsNumber()
  @Min(40)
  @Max(200)
  pesoActual?: number;

  @IsOptional()
  @IsNumber()
  @Min(40)
  @Max(200)
  pesoObjetivo?: number;

  @IsOptional()
  @IsDateString()
  fechaCompetencia?: string;

  @IsOptional()
  @IsString()
  experiencia?: string;

  @IsOptional()
  @IsDateString()
  fechaCreacion?: string;
}