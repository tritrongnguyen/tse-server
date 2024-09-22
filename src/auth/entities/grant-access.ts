import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from './role.entity';

@Entity({
  name: 'grant_access',
})
export class GrantAccess {
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'user_id',
  })
  @ManyToOne(() => User, (user) => user.grantAccesses)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @PrimaryColumn('varchar', {
    length: 50,
    name: 'role_id',
  })
  @ManyToOne(() => Role, (role) => role.grantAccesses)
  @JoinColumn({ name: 'role_id' })
  public role: Role;

  @Column('bit', {
    default: true,
    name: 'is_grant',
    nullable: false,
  })
  public isGrant: boolean;
}
