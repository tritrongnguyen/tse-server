import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity({
  name: 'accesses_grant',
})
export class AccessGrant {
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
  @ManyToOne(() => Role, (role) => role.accessesGrant, {
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  public role: Role;

  @Column('bit', {
    default: true,
    name: 'is_grant',
    nullable: false,
    transformer: {
      to: (value: boolean) => Buffer.from([value ? 1 : 0]),
      from: (value: Buffer) => value[0] !== 0,
    },
  })
  public isGrant: boolean;

  @Column('nvarchar', {
    default: '',
    nullable: false,
    length: 100,
  })
  notes: string;

  constructor(user?: User, role?: Role, isGrant?: boolean, notes?: string) {
    this.user = user;
    this.role = role;
    this.isGrant = isGrant;
    this.notes = notes;
  }
}
