import { AuthService } from './auth.service';
import { Controller, Post, Body, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CheckAdminSubnameRequest } from './interfaces/checkAdminSubnameRequest.interface';
import { Request, Response, response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('nonce')
  getNonce(@Res() response: Response) {
    try {
      const nonce = this.authService.generateNonce();
      response.status(201).send(nonce)
    } catch (error) {
      response.status(500).send({ error: error.message });
    }
  }

  @Get('adminsubname')
  @UseGuards(AuthGuard)
  async checkAdminSubname(@Res() response: Response, @Req() req: Request, @Query() query: CheckAdminSubnameRequest) {
    try {
      const checkAdminSubname = await this.authService.checkAdminSubnames(req, query);
      response.status(200).send(checkAdminSubname);
    } catch (error) {
      response.status(500).send({ error: error.message });
    }

  }

  @Post('authenticate')
  async authenticate(@Res() response: Response, @Req() req: Request, @Body() body: { message: string; signature: string }) {
    try {
      const isAuthenticated = await this.authService.authenticate(req, body.message, body.signature);
      response.status(200).send(isAuthenticated);
    } catch (error) {
      response.status(500).send({ error: error.message });
    }
  }
}

