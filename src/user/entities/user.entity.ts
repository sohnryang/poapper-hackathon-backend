import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  studentId: string;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column()
  @Exclude()
  passwordHash: string;
}
