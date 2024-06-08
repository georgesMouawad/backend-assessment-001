import { AuthService } from './auth.service';
import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('nonce')
  getNonce(@Res() res: Response) {
    try {
      const nonce = this.authService.generateNonce();
      res.status(201).send(nonce)
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  @Post('authenticate')
  async authenticate(@Res() res: Response, @Req() req: Request, @Body() body: { message: string; signature: string }) {
    try {
      const isAuthenticated = await this.authService.authenticate(req, body.message, body.signature);
      res.status(200).send(isAuthenticated);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  @Get('check-admin')
  @UseGuards(AuthGuard)
  async checkAdminSubname(@Res() res: Response, @Req() req: Request) {
    try {
      const checkAdminSubname = await this.authService.checkAdminSubnames(req);
      res.status(200).send(checkAdminSubname);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  @Get('/check-session')
  @UseGuards(AuthGuard)
  checkSession(@Req() req: Request, @Res() res: Response) {
    res.status(200).send({ authenticated: true, address: req.session.siwe.address });
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response): void {
    req.session.destroy(err => {
      if (err) {
        res.status(500).send('Failed to clear session');
      } else {
        res.status(200).send('Session cleared');
      }
    });
  }
}

