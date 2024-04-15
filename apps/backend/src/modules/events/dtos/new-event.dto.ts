import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventLocation } from '../event.entity';

export class NewEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  location: EventLocation;

  @IsNumber()
  date: number;

  @IsBoolean()
  isPrivate: boolean;

  // @IsNotEmpty()
  // contract: Contract;

  // @IsNotEmpty()
  // company: Company;

  @IsOptional()
  createdAt: number;

  @IsOptional()
  createdBy: number;
}
