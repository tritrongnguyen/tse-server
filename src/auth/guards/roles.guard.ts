import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../entities/role.entity';
import { ROLE_KEY } from '../customs';
import { RoleStatus } from '../entities/enums/role-status.enum';

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    const { rolesGrant } = user;
    const userRoles = [];
    rolesGrant.foreach((roleGrant: any) => {
      if (roleGrant.role.status === RoleStatus.ACTIVE)
        userRoles.push(roleGrant.role.roleName);
    });

    const hasRequiredRoles = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (hasRequiredRoles) return true;

    throw new ForbiddenException('Insufficient Permissions');
  }
}
