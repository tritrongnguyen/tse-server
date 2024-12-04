import { AccessGrant } from './access-grant.entity';
import { Activity } from './activity.entity';
import { Answer } from './answer.entity';
import { Attendance } from './attendance.entity';
import { Comment } from './comment.entity';
import { Group } from './group.entity';
import { MemberGroup } from './member-group.entity';
import { QnACategory } from './qna-category.entity';
import { QnaTag } from './qna-tag.entity';
import { QuestionTag } from './question-tag.entity';
import { Question } from './question.entity';
import { Role } from './role.entity';
import { UserActivity } from './user-activity.entity';
import { User } from './user.entity';
import { Vote } from './vote.entity';

export const appEntities = [
  User,
  Group,
  Role,
  MemberGroup,
  Attendance,
  Activity,
  AccessGrant,
  UserActivity,
  QnACategory,
  Question,
  Answer,
  Comment,
  Vote,
  QnaTag,
  QuestionTag,
];
