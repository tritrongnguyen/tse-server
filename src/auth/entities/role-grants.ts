import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from './role.entity';

@Entity({
  name: 'roles_grant',
})
export class RolesGrant {
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'user_id',
  })
  @ManyToOne(() => User, (user) => user.rolesGrant)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @PrimaryColumn('int', {
    name: 'role_id',
  })
  @ManyToOne(() => Role, (role) => role.roleGrants)
  @JoinColumn({ name: 'role_id' })
  public role: Role;

  @Column('bit', {
    default: true,
    name: 'is_grant',
    nullable: false,
  })
  public isGrant: boolean;
}
