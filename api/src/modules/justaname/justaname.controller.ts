import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { JustaNameService } from './justaname.service';
import { Response } from 'express';
import { AddSubnameRequest, RequestChallenge } from './interfaces';

@Controller('/justaname')
export class JustaNameController {
    constructor(private readonly justaNameService: JustaNameService) { }

    @Post('/subname')
    async addSubname(
        @Body() request: AddSubnameRequest,
        @Res() res: Response,
    ): Promise<any> {
        try {
            const subname = await this.justaNameService.addSubname(request);
            res.status(201).send(subname);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    @Post('/subname/revoke')
    async RevokeSubname(
        @Body() request: AddSubnameRequest,
        @Res() res: Response,
    ): Promise<any> {
        try {
            const revokeSubname = await this.justaNameService.revokeSubname(request)
            res.status(200).send(revokeSubname)
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    @Get('/request-challenge')
    async requestChallenge(@Res() res: Response, @Query() query: RequestChallenge) {
        try {
            const challengeResponse = await this.justaNameService.requestChallenge(query);
            res.status(200).send(challengeResponse)
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}