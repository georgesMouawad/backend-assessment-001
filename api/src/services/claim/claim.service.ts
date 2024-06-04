import { JustaName } from '@justaname.id/sdk';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subdomain } from 'src/interfaces/subdomain.interface';


@Injectable()
export class ClaimService implements OnModuleInit {
    justAName: JustaName

    constructor(readonly configService: ConfigService) {

    }

    async onModuleInit(): Promise<void> {
        await this.init();
    }

    async init() {
        this.justAName = await JustaName.init({
            apiKey: this.configService.get('JUSTANAME_API_KEY'),
        });
    }

    async claimSubdomain(request: Subdomain)



}
