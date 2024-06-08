import { AuthService } from './auth.service';
import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
import { CheckAdminSubnameRequest } from './interfaces/checkAdminSubnameRequest.interface';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('nonce')
    getNonce(@Req() req: Request) {
        const nonce = this.authService.generateNonce(req);
        return { nonce };
    }

    @Get('adminsubname')
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
      const isAuthenticated = await this.authService.authenticate(body.message, body.signature, req);
      if (isAuthenticated) {
        return { authenticated: true };
      } else {
        return { authenticated: false };
      }
    }
}

