import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private userService: UserService,
  ) {}

  async create(createPostDto: CreatePostDto, organizerId: number) {
    const organizer = await this.userService.findOne(organizerId);
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
}
