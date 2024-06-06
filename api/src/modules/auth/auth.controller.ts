import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authenticate')
  async authenticate(@Body() body: { message: string; signature: string }) {
    const isAuthenticated = await this.authService.authenticate(body.message, body.signature);
    if (isAuthenticated) {
      return { authenticated: true };
    } else {
      return { authenticated: false };
    }
  }
}

