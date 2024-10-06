import { AccessGrant } from './access-grant.entity';
import { Activity } from './activity.entity';
import { Attendance } from './attendance.entity';
import { Group } from './group.entity';
import { MemberGroup } from './member-group.entity';
import { Role } from './role.entity';
import { UserActivity } from './user-activity.entity';
import { User } from './user.entity';

export const appEntities = [
  User,
  Group,
  Role,
  MemberGroup,
  Attendance,
  Activity,
  AccessGrant,
  UserActivity,
];
