import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity({
  name: 'accesses_grant',
})
export class AccessesGrant {
  @PrimaryColumn('varchar', {
    length: 50,
  })
  @ManyToOne(() => Permission, (permission) => permission.grantPermissions)
  @JoinColumn({
    name: 'permission_id',
  })
  permission: Permission;

  @PrimaryColumn('varchar', {
    length: 50,
  })
  @ManyToOne(() => Role, (role) => role.accessesGrant)
  @JoinColumn({
    name: 'role_id',
  })
  role: Role;

  @Column('bit', {
    default: true,
    name: 'is_grant',
    nullable: false,
  })
  isGrant: boolean;

  @Column('nvarchar', {
    default: '',
    nullable: false,
    length: 100,
  })
  notes: string;
}
