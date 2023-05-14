import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth API')
@Controller()
export class AppController {
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
