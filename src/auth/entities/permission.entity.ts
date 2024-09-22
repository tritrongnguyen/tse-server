import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionStatus } from './enums/permission-status.enum';
import { GrantPermission } from './grant-permission';

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryColumn('varchar', {
    name: 'permission_id',
    length: 50,
  })
  permissionId: string;

  @Column('varchar', {
    nullable: false,
    name: 'permission_name',
    length: 50,
  })
  permissionName: string;

  @Column('enum', {
    enum: PermissionStatus,
    default: PermissionStatus.ACTIVE,
    nullable: false,
    enumName: 'permission_status',
  })
  status: PermissionStatus;

  @Column('varchar', {
    nullable: true,
    length: 100,
  })
  description: string;

  @OneToMany(
    () => GrantPermission,
    (grantPermission) => grantPermission.permission,
  )
  grantPermissions: GrantPermission[];
}
