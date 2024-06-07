import { AuthService } from './auth.service';
import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { CheckAdminSubnameRequest } from './interfaces/checkAdminSubnameRequest.interface';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('nonce')
    getNonce() {
        const nonce = this.authService.generateNonce();
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
    @UseGuards(AuthGuard)
    async authenticate(@Body() body: { message: string; signature: string }) {
        const isAuthenticated = await this.authService.authenticate(body.message, body.signature);
        if (isAuthenticated) {
            return { authenticated: true };
        } else {
            return { authenticated: false };
        }
    }
}

