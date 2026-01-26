import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min
} from 'class-validator';

export class CreateDeveloperDto {
  @IsInt()
  @Min(0)
  experience: number;

  @IsInt()
  @Min(0)
  hourlyRate: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsString()
  userId: string;
}
