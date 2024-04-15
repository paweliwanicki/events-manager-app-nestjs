import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  dateOfBirth: number;

  @Column({ default: 'en' })
  lang: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  @Exclude()
  password: string;

  @Column()
  createdAt: number;

  @Column({ nullable: true })
  updatedAt: number;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @AfterInsert()
  logInsert() {
    console.log('User is created with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User is updated with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('User is removed with id ', this.id);
  }
}
