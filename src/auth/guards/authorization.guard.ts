import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../customs';
import { Roles } from 'utils/security-constants';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { authen } = context.switchToHttp().getRequest();
    const haveRequireRoles = requiredRoles.some((role) =>
      authen.roles?.includes(role),
    );

    if (haveRequireRoles) return true;

    throw new ForbiddenException('Insufficient Permissions');
  }
}
