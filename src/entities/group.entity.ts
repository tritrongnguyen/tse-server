import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { MemberGroup } from './member-group.entity';
import { Expose, Transform } from 'class-transformer';

@Entity({
  name: 'groups',
})
export class Group {
  @PrimaryGeneratedColumn('increment', {
    name: 'group_id',
    type: 'bigint',
  })
  readonly groupId: number;

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

  @OneToMany(() => MemberGroup, (memberGroup) => memberGroup.group, {
    eager: true,
  })
  @Expose({ name: 'groupMembers' })
  @Transform(
    ({ value }) =>
      value.map((memberGroup: MemberGroup) => {
        return {
          user_id: memberGroup.member,
          status: memberGroup.status,
          is_leader: memberGroup.isLeader,
        };
      }),
    {
      toPlainOnly: true,
    },
  )
  groupMembers: MemberGroup[];
}
