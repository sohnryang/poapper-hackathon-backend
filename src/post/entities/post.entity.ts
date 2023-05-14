import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  @ApiResponseProperty({ example: 42 })
  id: number;

  @Column()
  @ApiResponseProperty({ example: 'Example Title' })
  title: string;

  @Column()
  imageLink: string;

  @Column({ type: 'timestamptz' })
  registerationDeadline: Date;

  @ManyToOne(() => User, (user) => user.posts)
  organizer: User;

  @ManyToMany(() => User, (user) => user.registeredEvents)
  @JoinTable()
  registeredUsers: User[];
}
