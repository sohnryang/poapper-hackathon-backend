import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@ApiTags('Auth API')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Login and get token' })
  @ApiBody({
    schema: {
      properties: {
        username: {
          type: 'string',
          description: 'POVIS username',
          example: 'povisusername',
        },
        password: {
          type: 'string',
          description: 'Password',
          example: 'weakpassword',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Login succeeded.',
    schema: {
      properties: {
        token: {
          type: 'string',
          description: 'JWT token',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid username or password.' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
