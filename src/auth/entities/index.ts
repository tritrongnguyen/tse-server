import { RolesGrant } from './role-grants';
import { LoginLog } from './login-log';
import { AccessesGrant } from './access-grants';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

export const authEntities = [
  Role,
  Permission,
  LoginLog,
  RolesGrant,
  AccessesGrant,
];
