import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Event } from './event.entity';

@Entity()
export class EventParticipation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Event, (event) => event.id)
  @JoinColumn()
  event: Event;

  @Column()
  createdAt: number;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  modifiedBy: number;

  @Column({ nullable: true })
  modifiedAt: number;

  @AfterInsert()
  logInsert() {
    console.log('Event participation is created with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Event participation is updated with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Event participation is removed with id ', this.id);
  }
}
