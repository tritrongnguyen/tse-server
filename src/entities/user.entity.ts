import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Faculty } from './enums/faculty.enum';
import { Exclude, Expose } from 'class-transformer';
import { UserStatus, UserType } from './enums/user.enum';
import { AccessGrant } from './access-grant.entity';
import { MemberGroup } from './member-group.entity';
import { UserActivity } from './user-activity.entity';
import { Question } from './question.entity';
@Entity({
  name: 'users',
})
export class User {
  @PrimaryColumn({
    type: 'varchar',
    name: 'user_id',
    length: 10,
  })
  @Expose()
  public userId: string;

  @Column('varchar', {
    nullable: false,
    name: 'hashed_password',
    length: 100,
  })
  @Exclude()
  public hashedPassword: string;

  @Column('timestamp', {
    name: 'register_date',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public registerDate: Date;

  @Column('varchar', {
    length: 100,
    nullable: false,
    unique: true,
  })
  @Expose()
  public email: string;

  @Column('varchar', {
    length: 11,
    name: 'phone_number',
    unique: true,
    nullable: true,
  })
  @Expose()
  public phoneNumber: string;

  @Column('nvarchar', {
    name: 'first_name',
    length: 40,
    nullable: false,
  })
  @Expose()
  public firstName: string;

  @Column('nvarchar', {
    name: 'last_name',
    length: 40,
    nullable: false,
  })
  @Expose()
  public lastName: string;

  @Column('enum', {
    enum: UserType,
    name: 'user_type',
    enumName: 'user_types',
    nullable: false,
    default: UserType.STUDENT,
  })
  @Expose()
  public userType: UserType;

  @Column('enum', {
    enum: Faculty,
    nullable: false,
    enumName: 'faculties',
    default: Faculty.OTHER,
  })
  @Expose()
  public faculty: Faculty;

  @Column('nvarchar', {
    length: 20,
    name: 'class_name',
    nullable: true,
  })
  @Expose()
  public className: string;

  @Column('int', {
    name: 'cumulative_score',
    nullable: false,
    default: 0,
  })
  @Expose()
  public cumulativeScore: number;

  @Column('enum', {
    enum: UserStatus,
    enumName: 'user_status',
    nullable: false,
    default: UserStatus.ACTIVE,
  })
  @Expose()
  public status: UserStatus;

  @OneToMany(() => AccessGrant, (accessGrant) => accessGrant.user, {
    lazy: true,
  })
  public rolesGrant: Promise<AccessGrant[]>;

  @OneToMany(() => MemberGroup, (memberGroups) => memberGroups.member, {
    lazy: true,
  })
  groupMembers: Promise<MemberGroup[]>;

  @OneToMany(() => UserActivity, (userActivity) => userActivity.user, {
    lazy: true,
  })
  userActivities: Promise<UserActivity[]>;

  @OneToMany(() => Question, (question) => question.user, {
    lazy: true,
  })
  questions: Promise<Question[]>;

  constructor(
    userId?: string,
    hashedPassword?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    status?: UserStatus,
  ) {
    this.userId = userId;
    this.hashedPassword = hashedPassword;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = status;
  }
}
