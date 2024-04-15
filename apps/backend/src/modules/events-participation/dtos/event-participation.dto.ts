import { Expose } from 'class-transformer';
import { User } from 'src/modules/users/user.entity';

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
  @Expose()
  modifiedAt: number;
  @Expose()
  modifiedBy: number;
}
