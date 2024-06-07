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

  generateNonce(req?: Request): string {
    const nonce = generateNonce();
    req.session.nonce = nonce;
    return nonce;
  }

  async authenticate(message: string, signature: string, req: Request): Promise<boolean> {
    try {
      const siweMessage = new SiweMessage(message);
      const { success, data } = await siweMessage.verify({ signature });

      if (success && data.address) {
        req.session.siwe = data;

        if (typeof data.expirationTime === 'undefined') {
          const expirationTime = new Date();
          expirationTime.setHours(expirationTime.getHours() + 1);
          data.expirationTime = expirationTime.toISOString();
        }

        req.session.cookie.expires = new Date(data.expirationTime);
        req.session.save();
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
      const adminRecordIndex = domain.data.textRecords.findIndex(record => record.key === 'admin');
      return adminRecordIndex >= 0;
    } catch (error) {
      throw new Error('Checking for admin subname failed: ' + error.message);
    }
  }
}
