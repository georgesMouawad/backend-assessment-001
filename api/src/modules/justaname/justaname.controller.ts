import { Controller, Post, Body, Res } from '@nestjs/common';
import { JustaNameService } from './justaname.service';
import { Response } from 'express';
import { Subdomain } from './interfaces/subdomain.interface';

@Controller('justaname')
export class JustaNameController {
    constructor(private readonly justaNameService: JustaNameService) { }

    @Post('/justaname/subdomain/')
    async addSubdomain(
        @Body() request: Subdomain,
        @Res() response: Response,
    ): Promise<any> {
        const subdomain = await this.justaNameService.addSubdomain(request);
        response.status(subdomain.error ? 500 : 201).send(subdomain);
    }
}
