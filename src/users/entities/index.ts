import { PermissionRole } from './permission-role.entity';
import { Permission } from './permission.entity';
import { Role } from './role.entity';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';

export const userEntities = [User, Role, UserRole, Permission, PermissionRole];
