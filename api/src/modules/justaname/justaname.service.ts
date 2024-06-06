import { ChainId, JustaName } from '@justaname.id/sdk';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subdomain, RequestChallenge } from './interfaces';

@Injectable()
export class JustaNameService implements OnModuleInit {
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

    async onModuleInit() {
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
            };
        }

        console.log('REQUEST', request)

        try {

            const params: any = {
                username: request.username,
                ensDomain: this.ensDomain,
                chainId: this.chainId,
            };

            // console.log('Username', params.username);
            // console.log('ENSDOM', params.ensDomain);
            // console.log('ChainId', params.chainId);

            if (request.isAdmin !== undefined && request.isAdmin) {
                console.log('HERE ADMIN')
                params.text = [{ key: 'admin', value: JSON.stringify([`${request.username}.${this.ensDomain}`]) }];
                console.log('textRecords', params.text)
            }

            // console.log('xSig', request.signature);
            // console.log('xAdd', request.address);
            // console.log('xMes', request.message);
            console.log('END')

            const addResponse = await this.justaName.subnames.addSubname(params, {
                xSignature: request.signature,
                xAddress: request.address,
                xMessage: request.message,
            });

            return addResponse;

        } catch (error) {
            return {
                error: error.message
            };
        }
    }

    async revokeSubdomain(request: Subdomain): Promise<any> {

        if (!request.username) {
            return {
                message: 'Username is required',
            };
        }

        try {

            const params: any = {
                username: request.username,
                ensDomain: this.ensDomain,
                chainId: this.chainId,
            };

            const revokeResponse = await this.justaName.subnames.revokeSubname(params, {
                xSignature: request.signature,
                xAddress: request.address,
                xMessage: request.message,
            });

            return revokeResponse;

        } catch (error) {
            return {
                error: error.message
            };
        }

    }

    async requestChallenge(request: RequestChallenge): Promise<any> {

        if (!request.address) {
            return {
                message: 'Address is required',
            };
        }

        try {

            const challengeResponse = await this.justaName.siwe.requestChallenge({
                chainId: this.chainId as ChainId,
                origin: this.origin,
                address: request.address,
                domain: this.domain,
            });

            return challengeResponse;

        } catch (error) {
            return {
                error: error.message,
            };
        }
    }



}
