import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RoleStatus } from './enums/role-status.enum';
import { GrantAccess } from './grant-access';
import { GrantPermission } from './grant-permission';

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryColumn('varchar', {
    length: 50,
    name: 'role_id',
  })
  public roleId: string;

  @Column('varchar', {
    nullable: false,
    name: 'role_name',
    length: 40,
  })
  public roleName: string;

  @Column('enum', {
    enum: RoleStatus,
    default: RoleStatus.ACTIVE,
    nullable: false,
    enumName: 'role_status',
  })
  public status: RoleStatus;

  @Column('nvarchar', {
    nullable: true,
    length: 250,
  })
  public description: string;

  @OneToMany(() => GrantAccess, (grantAccess) => grantAccess.role)
  public grantAccesses: GrantAccess[];

  @OneToMany(() => GrantPermission, (grantPermission) => grantPermission.role)
  public grantPermission: GrantPermission[];
}
