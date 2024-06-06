import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { JustaNameService } from './justaname.service';
import { Response } from 'express';
import { Subdomain } from './interfaces/subdomain.interface';
import { RequestChallenge } from './interfaces';

@Controller('/justaname')
export class JustaNameController {
    constructor(private readonly justaNameService: JustaNameService) { }

    @Post('/subdomain')
    async addSubdomain(
        @Body() request: Subdomain,
        @Res() response: Response,
    ): Promise<any> {
        console.log('controller', request)
        const subdomain = await this.justaNameService.addSubdomain(request);
        response.status(subdomain.error ? 500 : 201).send(subdomain);
    }

    @Post('/subdomain/revoke')
    async RevokeSubdomain(
        @Body() request: Subdomain,
        @Res() response: Response,
    ): Promise<any> {
        const revokeSubdomain = await this.justaNameService.revokeSubdomain(request)
        response.status(revokeSubdomain.error ? 500 : 200).send(revokeSubdomain)
    }

    @Get('/requestchallenge')
    async requestChallenge(@Query() query: RequestChallenge) {
        return this.justaNameService.requestChallenge(query);
    }
}