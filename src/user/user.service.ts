import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const user = new User();
    user.username = createUserDto.username;
    user.studentId = createUserDto.studentId;
    user.fullName = createUserDto.fullName;
    user.phoneNumber = createUserDto.phoneNumber;
    user.passwordHash = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
    });
    await this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const user = new User();
    user.fullName = updateUserDto.fullName;
    user.phoneNumber = updateUserDto.phoneNumber;
    user.passwordHash = await argon2.hash(updateUserDto.password, {
      type: argon2.argon2id,
    });
    await this.userRepository.update(id, user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
