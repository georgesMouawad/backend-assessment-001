import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ClaimService } from './services/justaname/justaname.service';
import { Subdomain } from './interfaces/subdomain.interface';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly claimService: ClaimService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/subdomain/add')
  async addSubdomain(
    @Body() request: Subdomain,
    @Res() response: Response,
  ): Promise<any> {
    const subdomain = await this.claimService.addSubdomain(request);
    response.status(subdomain.error ? 500 : 201).send(subdomain);
  }
}
