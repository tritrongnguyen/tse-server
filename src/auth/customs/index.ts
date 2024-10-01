import { SetMetadata } from '@nestjs/common';
import { Roles } from 'utils/security-constants';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLE_KEY = 'roles';
export const RequiredRoles = (...roles: Roles[]) =>
  SetMetadata(ROLE_KEY, roles);
