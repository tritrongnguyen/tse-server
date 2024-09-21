import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity({
  name: 'user_roles',
})
export class UserRole {
  @PrimaryColumn({
    name: 'id',
    type: 'bigint',
  })
  userRoleId: number;

  @ManyToOne(() => User, (user) => user.userRoles)
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({
    name: 'role_id',
  })
  role: Role;
}
