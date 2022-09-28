import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!context.getArgs()[2].req.session.userId) {
      return false;
    }

    return true;
  }
}
