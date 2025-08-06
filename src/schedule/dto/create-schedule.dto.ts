import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  screenId: number;
  @IsOptional()
  @IsDateString()
  startTime?: string;
  @IsOptional()
  @IsDateString()
  endTime?: string;
  @IsOptional()
  @IsString()
  daysOfWeek?: string;
  @IsOptional()
  @IsBoolean()
  repeatDaily?: boolean;
  @IsOptional()
  @IsInt()
  priority?: number;
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  playlists: number[];
}
