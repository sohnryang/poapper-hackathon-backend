import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/local-auth.guard';

@ApiTags('Auth API')
@Controller()
export class AppController {
  @UseGuards(LocalAuthGuard)
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
