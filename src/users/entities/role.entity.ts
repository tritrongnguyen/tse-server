import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleStatus } from './enums/role-status.enum';
import { PermissionRole } from './permission-role.entity';
import { UserRole } from './user-role.entity';

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
  })
  roleId: number;

  @Column('varchar', {
    nullable: false,
    name: 'role_name',
    length: 40,
  })
  roleName: string;

  @Column('enum', {
    enum: RoleStatus,
    default: RoleStatus.ACTIVE,
    nullable: false,
    enumName: 'role_status',
  })
  status: RoleStatus;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @OneToMany(() => PermissionRole, (permissionRole) => permissionRole.role)
  permissionRoles: PermissionRole[];

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
