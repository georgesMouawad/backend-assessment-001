import { Injectable } from '@nestjs/common';
import { SiweMessage, generateNonce } from 'siwe';

@Injectable()
export class AuthService {

  generateNonce(): string {
    return generateNonce();
  }

  async authenticate(message: string, signature: string): Promise<boolean> {
    try {
      const siweMessage = new SiweMessage(message);
      const { success, data } = await siweMessage.verify({ signature });

      if (success && data.address) {
        return true;
      } else {
        throw new Error('Signature verification failed');
      }
    } catch (error) {
      throw new Error('Authentication failed: ' + error.message);
    }
  }
}
