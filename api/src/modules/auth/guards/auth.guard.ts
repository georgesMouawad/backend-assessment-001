import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('authguard request session', request.session);
    
    return !!(request.session && request.session.siwe && request.session.siwe.address);
  }
}
