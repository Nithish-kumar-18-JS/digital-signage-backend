import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { ScreenOrientation, ScreenStatus } from '@prisma/client';

export class CreateScreenDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(ScreenStatus)
  status?: ScreenStatus;

  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsEnum(ScreenOrientation)
  orientation?: ScreenOrientation;

  @IsOptional()
  @IsDateString()
  lastSeen?: string;
}
