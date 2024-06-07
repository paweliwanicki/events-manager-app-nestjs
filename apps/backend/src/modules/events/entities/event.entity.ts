import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { EventParticipation } from './event-participation.entity';

export type EventLocation = { address: string; lat: number; lng: number };

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date: number;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  location: EventLocation;

  @Column()
  isPrivate: boolean;

  @Column()
  createdAt: number;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  modifiedBy: number;

  @Column({ nullable: true })
  modifiedAt: number;

  @Column({ default: false })
  archived: boolean;

  @OneToMany(() => EventParticipation, (participation) => participation.event)
  participatedUsers: EventParticipation[];

  @AfterInsert()
  logInsert() {
    console.log('Event is created with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Event is updated with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Event is removed with id ', this.id);
  }
}
