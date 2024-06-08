import { ChainId, JustaName } from '@justaname.id/sdk';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SiweMessage, generateNonce } from 'siwe';
import { Request } from 'express';
import { CheckAdminSubnameRequest } from './interfaces/checkAdminSubnameRequest.interface';

@Injectable()
export class AuthService implements OnModuleInit {
  justaName: JustaName;
  chainId: number;

  constructor(private readonly configService: ConfigService) {
    this.chainId = parseInt(this.configService.get('JUSTANAME_CHAIN_ID'));
  }

  async onModuleInit() {
    await this.init();
  }

  async init() {
    this.justaName = await JustaName.init({
      apiKey: this.configService.get('JUSTANAME_API_KEY'),
    });
  }

  generateNonce(): string {
    return generateNonce();
  }

  async authenticate(req: Request, message: string, signature: string): Promise<boolean> {
    try {

      const siweMessage = new SiweMessage(message);
      const { success, data } = await siweMessage.verify({ signature });

      if (success && data.address) {
        req.session.siwe = data;
        req.session.cookie.expires = new Date(Date.now() + 60 * 60 * 1000);
        req.session.save();
        console.log('AUTHENTICATE SESSION', req.session);
        return true;
      } else {
        throw new Error();
      }
    } catch (error) {
      throw new Error('Authentication failed: ' + error.message);
    }
  }

  async checkAdminSubnames(request: CheckAdminSubnameRequest): Promise<boolean> {
    try {

      const domain = await this.justaName.subnames.getBySubname({ subname: request.domain, chainId: this.chainId as ChainId });
      // const addressFound = domain.data.addresses.find(addr => addr.address === request.domainaddress);

      // if (!addressFound) return false;

      const adminRecordIndex = domain.data.textRecords.findIndex(record => record.key === 'admin');
      return adminRecordIndex >= 0;

    } catch (error) {
      throw new Error('Checking for admin subname failed: ' + error.message);
    }
  }
}
