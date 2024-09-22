import { GrantAccess } from './grant-access';
import { LoginLog } from './login-log';
import { GrantPermission } from './grant-permission';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

export const authEntities = [
  Role,
  Permission,
  LoginLog,
  GrantAccess,
  GrantPermission,
];
