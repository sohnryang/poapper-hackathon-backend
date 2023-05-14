import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
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
  @ApiResponseProperty({ example: 'Example Description' })
  description: string;

  @Column()
  @ApiResponseProperty({ example: 'https://example.com/poster.png' })
  imageLink: string;

  @Column({ type: 'timestamptz' })
  @ApiResponseProperty({ example: '2023-05-14T10:00:00.000Z' })
  registerationDeadline: Date;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @Exclude()
  organizer: User;

  @Expose()
  get organizerId(): number {
    return this.organizer.id;
  }

  @ManyToMany(() => User, (user) => user.registeredEvents)
  @JoinTable()
  registeredUsers: User[];
}
