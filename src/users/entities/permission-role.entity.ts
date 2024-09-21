import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity({
  name: 'permission_roles',
})
export class PermissionRole {
  @PrimaryGeneratedColumn('identity', {
    type: 'bigint',
    name: 'id',
  })
  permissionRoleId: number;

  @ManyToOne(() => Permission, (permission) => permission.permissionRoles)
  @JoinColumn({
    name: 'permission_id',
  })
  permission: number;

  @ManyToOne(() => Role, (role) => role.permissionRoles)
  @JoinColumn({
    name: 'role_id',
  })
  role: number;
}
