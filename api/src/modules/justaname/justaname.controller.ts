import { Controller, Post, Body, Res, Get, Query, UseGuards } from '@nestjs/common';
import { JustaNameService } from './justaname.service';
import { Response } from 'express';
import { AddSubnameRequest, RequestChallenge } from './interfaces';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('/justaname')
export class JustaNameController {
    constructor(private readonly justaNameService: JustaNameService) { }

    @Post('/subname')
    // @UseGuards(AuthGuard)
    async addSubname(
        @Body() request: AddSubnameRequest,
        @Res() response: Response,
    ): Promise<any> {
        const subname = await this.justaNameService.addSubname(request);
        response.status(subname?.error ? 500 : 201).send(subname);
    }

    @Post('/subname/revoke')
    // @UseGuards(AuthGuard)
    async RevokeSubname(
        @Body() request: AddSubnameRequest,
        @Res() response: Response,
    ): Promise<any> {
        const revokeSubname = await this.justaNameService.revokeSubname(request)
        response.status(revokeSubname?.error ? 500 : 200).send(revokeSubname)
    }

    @Get('/requestchallenge')
    // @UseGuards(AuthGuard)
    async requestChallenge(@Query() query: RequestChallenge) {
        return this.justaNameService.requestChallenge(query);
    }
}