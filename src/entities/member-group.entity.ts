import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';
import { MemberGroupStatus } from './enums/member-group.enum';
import { Expose } from 'class-transformer';

@Entity({
  name: 'member_group',
})
export class MemberGroup {
  @PrimaryColumn('bigint', {
    name: 'group_id',
  })
  @ManyToOne(() => Group, (group) => group.groupMembers)
  @JoinColumn({ name: 'group_id' })
  @Expose({ name: 'group_id' })
  group: Group;

  @PrimaryColumn('varchar', {
    length: 10,
    name: 'user_id',
  })
  @ManyToOne(() => User, (user) => user.groupMembers)
  @JoinColumn({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  member: User;

  @Column('bit', {
    name: 'is_leader',
    default: false,
    transformer: {
      to: (value: boolean) => Buffer.from([value ? 1 : 0]),
      from: (value: Buffer) => value[0] !== 0,
    },
  })
  @Expose({ name: 'is_leader' })
  isLeader: boolean;

  @Column('enum', {
    enum: MemberGroupStatus,
    default: MemberGroupStatus.IN,
  })
  status: MemberGroupStatus;
}
