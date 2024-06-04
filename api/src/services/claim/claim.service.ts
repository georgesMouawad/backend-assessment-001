import { JustaName } from '@justaname.id/sdk';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subdomain } from 'src/interfaces/subdomain.interface';


@Injectable()
export class ClaimService implements OnModuleInit {
    justaName: JustaName;
    chainId: number;
    domain: string;
    origin: string;
    ensDomain: string;

    constructor(readonly configService: ConfigService) {
        this.chainId = parseInt(this.configService.get('JUSTANAME_CHAIN_ID'));
        this.domain = this.configService.get('JUSTANAME_DOMAIN');
        this.origin = this.configService.get('JUSTANAME_ORIGIN');
        this.ensDomain = this.configService.get('JUSTANAME_ENS_DOMAIN');
    }

    async onModuleInit(): Promise<void> {
        await this.init();
    }

    async init() {
        this.justaName = await JustaName.init({
            apiKey: this.configService.get('JUSTANAME_API_KEY'),
        });
    }

    async addSubdomain(request: Subdomain): Promise<any> {
        if (!request.username) {
            return {
                message: 'Username is required',
            }
        }

        try {

            const addResponse = await this.justaName.subnames.addSubname({
                username: request.username,
                ensDomain: this.ensDomain,
                chainId: this.chainId,
            }, {
                xSignature: request.signature,
                xAddress: request.address,
                xMessage: request.message,
            })

            return addResponse;

        } catch (error) {

            return {
                error: error.message
            };

        }
    }



}
