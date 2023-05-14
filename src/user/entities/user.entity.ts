import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
