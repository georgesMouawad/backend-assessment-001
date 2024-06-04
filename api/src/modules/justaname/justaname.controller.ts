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
        const subdomain = await this.justaNameService.addSubdomain(request);
        response.status(subdomain.error ? 500 : 201).send(subdomain);
    }

    @Get('/siwe')
    async requestChallenge(@Query() query: RequestChallenge) {
        return this.justaNameService.requestChallenge(query);
    }
}
