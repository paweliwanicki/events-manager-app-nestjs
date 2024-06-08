import { Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

export class EventParticipationDto {
  @Expose()
  id: number;
  @Expose()
  user: User;
  @Expose()
  event: Event;
  @Expose()
  createdAt: number;
  @Expose()
  createdBy: number;
  modifiedAt: number;
  modifiedBy: number;
}
