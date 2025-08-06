import { IsEnum, IsOptional, IsString, IsDateString, IsArray, IsNumber, IsInt } from 'class-validator';
import { ScreenOrientation, ScreenStatus } from '@prisma/client';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber()
  playlistLinks?: number[];

  @IsOptional()
  @IsInt()
  createdBy?: number;
}
