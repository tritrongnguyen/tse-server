import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';
import { MemberGroupStatus } from './enums/member-group.enum';

@Entity({
  name: 'member_group',
})
export class MemberGroup {
  @PrimaryColumn('bigint', {
    name: 'group_id',
  })
  @ManyToOne(() => Group, (group) => group.groupMembers)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @PrimaryColumn('varchar', {
    length: 10,
    name: 'user_id',
  })
  @ManyToOne(() => User, (user) => user.groupMembers)
  @JoinColumn({ name: 'user_id' })
  member: User;

  @Column('enum', {
    enum: MemberGroupStatus,
    default: MemberGroupStatus.IN,
  })
  status: MemberGroupStatus;
}
