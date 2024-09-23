import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/auth/entities/permission.entity';
import { Role } from 'src/auth/entities/role.entity';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLE_KEY = 'roles';
export const RequireRoles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);

export const PERMISSION_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
