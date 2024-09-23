import { RoleGrant } from './role-grant';
import { LoginLog } from './login-log';
import { AccessGrant } from './access-grant';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

export const authEntities = [
  Role,
  Permission,
  LoginLog,
  RoleGrant,
  AccessGrant,
];
