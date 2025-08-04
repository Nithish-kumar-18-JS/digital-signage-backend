import { PlaylistItem, PlaylistOnScreen } from '@prisma/client';
import { IsString, IsOptional } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
  items?: PlaylistItem[];
  screenLinks?: PlaylistOnScreen[];

}
