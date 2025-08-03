import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string; // Will be parsed to MediaType in service
}
