import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlaylistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  items?: number[]; // this is now an array of foreign keys (IDs)

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  screenLinks?: number[]; // assuming same for screenLinks
}
