import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (user && (await argon2.verify(user.passwordHash, password)))
      return { id: user.id };
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return { token: this.jwtService.sign(payload) };
  }
}
