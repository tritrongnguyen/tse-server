import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserStatus } from './enums/user-status.enum';
import { LoginStatus } from './enums/login-status.enum';
import { UserType } from './enums/user-type.enum';
import { Faculty } from './enums/faculty.enum';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryColumn({
    type: 'bigint',
    name: 'id',
  })
  userId: number;

  @Column('text', {
    nullable: false,
    name: 'hashed_password',
  })
  hashedPassword: string;

  @Column('timestamp', {
    name: 'register_date',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  registerDate: Date;

  @Column('timestamp', {
    name: 'latest_login_time',
    nullable: true,
  })
  latestLogin: Date;

  @Column('varchar', {
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('varchar', {
    length: 11,
    name: 'phone_number',
    unique: true,
    nullable: true,
  })
  phoneNumber: string;

  @Column('nvarchar', {
    name: 'first_name',
    length: 40,
    nullable: false,
  })
  firstName: string;

  @Column('nvarchar', {
    name: 'last_name',
    length: 40,
    nullable: false,
  })
  lastName: string;

  @Column('enum', {
    enum: UserType,
    name: 'user_type',
    enumName: 'user_types',
    nullable: false,
    default: UserType.STUDENT,
  })
  userType: UserType;

  @Column('enum', {
    enum: Faculty,
    nullable: false,
    enumName: 'faculties',
    default: Faculty.OTHER,
  })
  faculty: Faculty;

  @Column('nvarchar', {
    length: 20,
    name: 'class_name',
    nullable: true,
  })
  className: string;

  @Column('int', {
    name: 'cumulative_score',
    nullable: false,
    default: 0,
  })
  cumulativeScore: number;

  @Column('enum', {
    enum: UserStatus,
    enumName: 'user_status',
    nullable: false,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column('enum', {
    enum: LoginStatus,
    enumName: 'login_status',
    nullable: false,
    default: LoginStatus.OFFLINE,
  })
  loginStatus: LoginStatus;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
