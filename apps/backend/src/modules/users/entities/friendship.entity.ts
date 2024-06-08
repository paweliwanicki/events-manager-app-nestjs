import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => User, (user) => user.id)
  friend: User;

  @Column({ default: false })
  isAccepted: boolean;

  @Column()
  createdAt: number;

  @Column({ nullable: true })
  updatedAt: number;

  @AfterInsert()
  logInsert() {
    console.log('Friendship is created with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Friendship is updated with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Friendship is removed with id ', this.id);
  }
}
