import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Post } from '../../post/entities/post.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiResponseProperty({ example: 42 })
  id: number;

  @Column()
  @ApiResponseProperty({ example: 'povisusername' })
  username: string;

  @Column()
  @ApiResponseProperty({ example: '20220123' })
  studentId: string;

  @Column()
  @ApiResponseProperty({ example: 'Nix Po' })
  fullName: string;

  @Column()
  @ApiResponseProperty({ example: '01012345678' })
  phoneNumber: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @OneToMany(() => Post, (post) => post.organizer, { cascade: ['remove'] })
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.registeredUsers, {
    cascade: ['remove'],
  })
  registeredEvents: Post[];
}
