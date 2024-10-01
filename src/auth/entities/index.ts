import { AccessGrant } from './access-grant';
import { UserStatus } from './enums/user-status.enum';
import { LoginLog } from './login-log';
import { Role } from './role.entity';

export const authEntities = [Role, LoginLog, AccessGrant];
