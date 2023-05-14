import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Connection, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private userService: UserService,
    private connection: Connection,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const organizer = await this.userService.findOne(createPostDto.userId);
    const post = new Post();
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.imageLink = createPostDto.imageLink;
    post.registerationDeadline = createPostDto.registerationDeadline;
    post.organizer = organizer;
    await this.postRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findOne(id: number): Promise<Post | null> {
    return this.postRepository.findOneBy({ id });
  }

  async findRegisteredUsers(id: number): Promise<User[]> {
    const post = await this.findOne(id);
    return post.registeredUsers;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = new Post();
    post.title = updatePostDto.title;
    post.description = updatePostDto.description;
    post.imageLink = updatePostDto.imageLink;
    post.registerationDeadline = updatePostDto.registerationDeadline;
    await this.postRepository.update({ id }, post);
  }

  async remove(id: number) {
    await this.postRepository.delete(id);
  }

  async registerUser(id: number, createRegistrationDto: CreateRegistrationDto) {
    const post = await this.postRepository.findOneBy({ id });
    const registeredUsers = post.registeredUsers;
    if (registeredUsers.find((u) => u.id == createRegistrationDto.userId))
      return;
    const user = await this.userService.findOne(createRegistrationDto.userId);
    registeredUsers.push(user);
    const newPost = this.connection.getRepository(Post).create();
    newPost.id = post.id;
    newPost.registeredUsers = registeredUsers;
    await this.connection.getRepository(Post).save(newPost);
  }

  async removeRegistration(
    id: number,
    createRegistrationDto: CreateRegistrationDto,
  ) {
    const post = await this.postRepository.findOneBy({ id });
    const registeredUsers = post.registeredUsers;
    const newPost = this.connection.getRepository(Post).create();
    newPost.id = post.id;
    newPost.registeredUsers = registeredUsers.filter(
      (u) => u.id != createRegistrationDto.userId,
    );
    await this.connection.getRepository(Post).save(newPost);
  }
}
