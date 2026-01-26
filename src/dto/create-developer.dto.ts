import {
  IsString,
  IsEmail,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateDeveloperDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsArray()
  @ArrayNotEmpty()
  skills: string[];

  @IsInt()
  @Min(0)
  experience: number;

  @IsInt()
  @Min(0)
  rate: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
