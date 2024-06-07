import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomRequest } from '../interfaces/customRequest.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    return !!(request.session && request.session.siwe && request.session.siwe.address);
  }
}
