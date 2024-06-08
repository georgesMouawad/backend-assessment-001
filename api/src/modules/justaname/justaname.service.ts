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


    async addSubname(request: AddSubnameRequest): Promise<any> {
        if (!request.username) {
            throw new Error('Username is required')
        }

        request.username = request.username.replace(/\s+/g, '').toLowerCase();

        try {

            const params: any = {
                username: request.username,
                ensDomain: this.ensDomain,
                chainId: this.chainId,
            };


            if (request.isAdmin !== undefined && request.isAdmin) {
                const rootDomain = await this.getRoodDomain();
                const isOwner = await this.checkPrivilege(rootDomain, request);
                if (isOwner) {
                    await this.updateTextRecords(rootDomain, request);
                } else {
                    throw new Error('Unauthorized');
                }
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

            this.deleteDomainRecord(this.ensDomain, request)

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


    private async getRoodDomain(): Promise<SubnameGetBySubnameResponse> {
        const rootDomainSubname = this.ensDomain;
        return this.justaName.subnames.getBySubname({ subname: rootDomainSubname, chainId: this.chainId as ChainId })
    }

    private async checkPrivilege(rootDomain: SubnameGetBySubnameResponse, request: AddSubnameRequest) {

        const addressFound = rootDomain.data.addresses.find(addr => addr.address === request.address);

        if (!addressFound) {
            return false
        }

        const verifyResponse = await this.justaName.siwe.verifyMessage({
            address: request.address,
            message: request.message,
            signature: request.signature,
        })


        if (!verifyResponse.verified) {
            return false
        }

        return true;
    }

    private async updateTextRecords(rootDomain: SubnameGetBySubnameResponse, request: AddSubnameRequest) {

        let updatedTextRecords = [];

        const adminRecordIndex = rootDomain.data.textRecords.findIndex(record => record.key === 'admin');

        if (adminRecordIndex >= 0) {
            updatedTextRecords = rootDomain.data.textRecords.map(record => {
                if (record.key === 'admin') {
                    const currentValue = JSON.parse(record.value);
                    currentValue.push(`${request.username}.${this.ensDomain}`);
                    record.value = JSON.stringify(currentValue);
                }
                return record;
            });

        } else {

            updatedTextRecords = [...rootDomain.data.textRecords, { key: 'admin', value: JSON.stringify([`${request.username}.${this.ensDomain}`]) }];
        }

        await this.updateSubnameRecords(rootDomain, request, updatedTextRecords);
    }

    private async updateSubnameRecords(subname: SubnameGetBySubnameResponse, request: AddSubnameRequest, textRecords: TextRecordResponse[] | {
        key: string;
        value: string;
    }[]) {
        await this.justaName.subnames.updateSubname({
            addresses: subname.data.addresses,
            chainId: this.chainId,
            contentHash: subname.data.contentHash,
            ensDomain: this.ensDomain,
            username: subname.username,
            text: textRecords,
        }, {
            xSignature: request.signature,
            xAddress: request.address,
            xMessage: request.message,
        });
    }

    private async deleteDomainRecord(domain: string, request: AddSubnameRequest) {
        const rootDomain = await this.justaName.subnames.getBySubname({ subname: domain, chainId: this.chainId as ChainId });
        const adminRecord = rootDomain.data.textRecords.find(record => record.key === 'admin');

        if (adminRecord) {
            const subname = `${request.username}.${domain}`;
            const adminValues = JSON.parse(adminRecord.value);
            const subnameIndex = adminValues.indexOf(subname);

            if (subnameIndex >= 0) {
                adminValues.splice(subnameIndex, 1);

                if (adminValues.length > 0) {
                    adminRecord.value = JSON.stringify(adminValues);
                } else {
                    rootDomain.data.textRecords = rootDomain.data.textRecords.filter(record => record.key !== 'admin');
                }

                await this.updateSubnameRecords(rootDomain, request, rootDomain.data.textRecords);
            }
        }

    }
}