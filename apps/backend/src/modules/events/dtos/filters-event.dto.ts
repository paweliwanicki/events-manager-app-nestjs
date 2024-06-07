import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { FindOperator } from 'typeorm';
import { EventLocation } from '../entities/event.entity';

export class FiltersEventDto {
  @IsString()
  @IsOptional()
  name: FindOperator<string>;

  @IsString()
  @IsOptional()
  location: EventLocation;

  @IsNumber()
  @IsOptional()
  date: number;

  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @IsBoolean()
  @IsOptional()
  archived = false;

  @IsOptional()
  createdBy: number;

  @IsOptional()
  participatedUsers: boolean;
}
