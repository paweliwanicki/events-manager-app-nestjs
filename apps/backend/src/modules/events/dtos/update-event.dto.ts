import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventLocation } from '../event.entity';

export class UpdateEventDto {
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  date: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  location: EventLocation;

  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @IsOptional()
  createdAt: number;

  @IsOptional()
  createdBy: number;
}
