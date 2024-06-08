import { AuthService } from './auth.service';
import { Controller, Post, Body, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CheckAdminSubnameRequest } from './interfaces/checkAdminSubnameRequest.interface';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('nonce')
  getNonce(@Res() response: Response) {
    const nonce = this.authService.generateNonce(); 
    nonce && response.status(201).send(nonce)
  }

  @Get('adminsubname')
  @UseGuards(AuthGuard)
  async checkAdminSubname(@Query() query: CheckAdminSubnameRequest) {
    const checkAdminSubname = await this.authService.checkAdminSubnames(query)
    if (checkAdminSubname) {
      return { admin: true };
    } else {
      return { admin: false };
    }
  }

  @Post('authenticate')
  async authenticate(@Req() req: Request, @Body() body: { message: string; signature: string }) {
    const isAuthenticated = await this.authService.authenticate(req, body.message, body.signature);
    if (isAuthenticated) {
      return { authenticated: true };
    } else {
      return { authenticated: false };
    }
  }
}

