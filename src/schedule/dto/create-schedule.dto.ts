import { IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  playlistId: number;

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
}
