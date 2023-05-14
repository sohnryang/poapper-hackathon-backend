import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Post as PostEntity } from './entities/post.entity';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Post API')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create post' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Post created successfully.' })
  @ApiForbiddenResponse({ description: "Editing other user's post." })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.create(createPostDto, req.user.id);
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Edit a post with ID' })
  @ApiOkResponse({ description: 'Edited successfully.' })
  @ApiForbiddenResponse({ description: "Editing other user's post." })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    const userId = req.user.id;
    if (userId != post.organizer.id) throw new ForbiddenException();
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a post with ID' })
  @ApiOkResponse({ description: 'Deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Post with ID not found.' })
  @ApiForbiddenResponse({ description: "Deleting other user's post." })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    const userId = req.user.id;
    if (userId != post.organizer.id) throw new ForbiddenException();
    return this.postService.remove(+id);
  }

  @Post('register/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Register to the event of a post with ID' })
  @ApiOkResponse({ description: 'Registered successfully.' })
  @ApiNotFoundResponse({ description: 'Post with ID not found.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiBearerAuth()
  async register(@Param('id') id: string, @Request() req) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    const userId = req.user.id;
    return this.postService.registerUser(+id, userId);
  }

  @Get('register/:id')
  async findRegisteredUsers(@Param('id') id: string) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    return this.postService.findRegisteredUsers(+id);
  }

  @Delete('register/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeRegistration(@Param('id') id: string, @Request() req) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException();
    const userId = req.user.id;
    return this.postService.removeRegistration(+id, userId);
  }
}
