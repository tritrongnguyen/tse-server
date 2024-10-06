import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleStatus } from './enums/role.enum';
import { IsNotEmpty } from 'class-validator';
import { AccessGrant } from './access-grant.entity';

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn('increment', {
    name: 'role_id',
    type: 'int',
  })
  public roleId: number;

  @Column('varchar', {
    nullable: false,
    name: 'role_name',
    length: 40,
    unique: true,
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
    nullable: false,
    default: 'role description',
    length: 250,
  })
  public description: string;

  @OneToMany(() => AccessGrant, (accessGrant) => accessGrant.role)
  public accessesGrant: AccessGrant[];
}
