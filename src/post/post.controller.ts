import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Post as PostEntity } from './entities/post.entity';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@ApiTags('Post API')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create post' })
  @ApiCreatedResponse({ description: 'Post created successfully.' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({
    description: 'Query succeeded.',
    type: PostEntity,
    isArray: true,
  })
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get a post with ID' })
  @ApiOkResponse({ description: 'Query succeeded.', type: PostEntity })
  @ApiNotFoundResponse({ description: 'Post with ID not found.' })
  async findOne(@Param('id') id: string) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit a post with ID' })
  @ApiOkResponse({ description: 'Edited successfully.' })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a post with ID' })
  @ApiOkResponse({ description: 'Deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Post with ID not found.' })
  async remove(@Param('id') id: string) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    return this.postService.remove(+id);
  }

  @Post('register/:id')
  @ApiOperation({ summary: 'Register to the event of a post with ID' })
  @ApiOkResponse({ description: 'Registered successfully.' })
  @ApiNotFoundResponse({ description: 'Post with ID not found.' })
  async register(
    @Param('id') id: string,
    createRegistrationDto: CreateRegistrationDto,
  ) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    return this.postService.registerUser(+id, createRegistrationDto);
  }

  @Get('register/:id')
  async findRegisteredUsers(@Param('id') id: string) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    return this.postService.findRegisteredUsers(+id);
  }

  @Delete('register/:id')
  async removeRegistration(
    @Param('id') id: string,
    createRegistrationDto: CreateRegistrationDto,
  ) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    return this.postService.removeRegistration(+id, createRegistrationDto);
  }
}
