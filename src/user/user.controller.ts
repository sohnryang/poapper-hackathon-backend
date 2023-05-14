import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('User API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'A new user is created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Query succeeded.', type: User, isArray: true })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get a user with id' })
  @ApiOkResponse({ description: 'Query succeeded.', type: User })
  @ApiNotFoundResponse({ description: 'User with ID not found.' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Edit a user with id' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Edited successfully.' })
  @ApiNotFoundResponse({ description: 'User wit ID not found.' })
  @ApiForbiddenResponse({ description: 'Editing other user.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException();
    if (req.user.id != id) throw new ForbiddenException();
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a user with id' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Deleted successfully.' })
  @ApiNotFoundResponse({ description: 'User with ID not found.' })
  @ApiForbiddenResponse({ description: 'Deleting other user.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  async remove(@Param('id') id: string, @Request() req) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException();
    if (req.user.id != id) throw new ForbiddenException();
    return this.userService.remove(+id);
  }
}
