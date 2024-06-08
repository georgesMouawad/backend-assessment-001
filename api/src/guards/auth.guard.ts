import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('Authguard session', request.session);
    if (request.session && request.session.siwe) {
      return true;
    } else {
      return false
    }
  }
}
