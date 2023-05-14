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
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('User API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ description: 'A new user is created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException();
    if (req.user.id != id) throw new ForbiddenException();
    return this.userService.remove(+id);
  }
}
