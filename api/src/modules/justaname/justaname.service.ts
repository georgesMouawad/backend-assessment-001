import { ChainId, JustaName, SubnameGetBySubnameResponse, TextRecordResponse } from '@justaname.id/sdk';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AddSubnameRequest, RequestChallenge } from './interfaces';

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

    async getDomainAdminRecord(rootDomain: SubnameGetBySubnameResponse): Promise<TextRecordResponse | undefined> {
        const domainAdminRecord = rootDomain.data.textRecords.find(record => record.key === 'admin');
        return domainAdminRecord;
    }

    async updateDomainRecords(rootDomain: SubnameGetBySubnameResponse, request: AddSubnameRequest, textRecords: any[]) {
        await this.justaName.subnames.updateSubname({
            addresses: rootDomain.data.addresses,
            chainId: this.chainId,
            contentHash: rootDomain.data.contentHash,
            ensDomain: this.ensDomain,
            username: rootDomain.username,
            text: textRecords,
        }, {
            xSignature: request.signature,
            xAddress: request.address,
            xMessage: request.message
        });
    }

    async checkAndUpdateRecords(domain: string, request: AddSubnameRequest) {

        const rootDomain = await this.justaName.subnames.getBySubname({ subname: domain, chainId: this.chainId as ChainId });
        const adminRecord = await this.getDomainAdminRecord(rootDomain);

        if (adminRecord) {

            const subname = request.username + '.' + domain;
            const adminValues = JSON.parse(adminRecord.value);
            const subnameIndex = adminValues.indexOf(subname);

            if (subnameIndex >= 0) {
                adminValues.splice(subnameIndex, 1);

                if (adminValues.length > 0) {
                    adminRecord.value = JSON.stringify(adminValues);
                } else {
                    rootDomain.data.textRecords = rootDomain.data.textRecords.filter(record => record.key !== 'admin');
                }

                console.log('New records', rootDomain.data.textRecords);

                await this.updateDomainRecords(rootDomain, request, rootDomain.data.textRecords);
            }
        }
    }

    async addSubname(request: AddSubnameRequest): Promise<any> {
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

            if (request.isAdmin !== undefined && request.isAdmin) {

                const rootDomainSubname = this.ensDomain;
                const rootDomain = await this.justaName.subnames.getBySubname({ subname: rootDomainSubname, chainId: this.chainId as ChainId })

                const adminRecordIndex = rootDomain.data.textRecords.findIndex(record => record.key === 'admin');

                if (adminRecordIndex >= 0) {
                    return {
                        message: 'Admin subname already set'
                    }
                }

                await this.justaName.subnames.updateSubname({
                    addresses: rootDomain.data.addresses,
                    chainId: this.chainId,
                    contentHash: rootDomain.data.contentHash,
                    ensDomain: this.ensDomain,
                    username: rootDomain.username,
                    text: [...rootDomain.data.textRecords, { key: 'admin', value: JSON.stringify([`${request.username}.${this.ensDomain}`]) }]
                }, {
                    xSignature: request.signature,
                    xAddress: request.address,
                    xMessage: request.message
                })
            }

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

    async revokeSubname(request: AddSubnameRequest): Promise<any> {

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

            this.checkAndUpdateRecords(this.ensDomain, request)

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
