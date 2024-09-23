import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionStatus } from './enums/permission-status.enum';
import { AccessesGrant } from './access-grants';

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryGeneratedColumn('identity', {
    name: 'permission_id',
    type: 'int',
  })
  permissionId: number;

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
    nullable: false,
    default: 'permission description',
    length: 100,
  })
  description: string;

  @OneToMany(() => AccessesGrant, (accessesGrant) => accessesGrant.permission)
  grantPermissions: AccessesGrant[];
}
