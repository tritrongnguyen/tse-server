import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { MemberGroup } from './member-group.entity';

@Entity({
  name: 'groups',
})
export class Group {
  @PrimaryGeneratedColumn('increment', {
    name: 'group_id',
    type: 'bigint',
  })
  groupId: number;

  @Column('nvarchar', {
    length: 255,
    name: 'group_name',
    nullable: false,
    unique: true,
  })
  groupName: string;

  @Column('nvarchar', {
    length: 255,
    default: 'group description',
  })
  description: string;

  @Column('int', {
    name: 'number_of_member',
    nullable: false,
  })
  memberNum: number;

  @Column('nvarchar', {
    length: 100,
    nullable: false,
    name: 'leader_name',
  })
  leaderName: string;

  @OneToMany(() => MemberGroup, (memberGroup) => memberGroup.group)
  groupMembers: MemberGroup[];
}
