import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionStatus } from './enums/permission-status.enum';
import { PermissionRole } from './permission-role.entity';

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
  })
  permissionId: number;

  @Column('varchar', {
    nullable: false,
    name: 'permission_name',
    length: 40,
  })
  permissionName: string;

  @Column('enum', {
    enum: PermissionStatus,
    default: PermissionStatus.ACTIVE,
    nullable: false,
    enumName: 'permission_status',
  })
  status: PermissionStatus;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @OneToMany(
    () => PermissionRole,
    (permissionRole) => permissionRole.permission,
  )
  permissionRoles: PermissionRole[];
}
