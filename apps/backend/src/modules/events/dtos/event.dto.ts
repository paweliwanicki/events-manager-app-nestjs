import { Expose } from 'class-transformer';
import { EventLocation } from '../entities/event.entity';

export class EventDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  date: number;
  @Expose()
  description: string;
  @Expose()
  location: EventLocation;
  @Expose()
  createdAt: number;
  @Expose()
  createdBy: number;
  @Expose()
  modifiedAt: number;
  @Expose()
  modifiedBy: number;
}
