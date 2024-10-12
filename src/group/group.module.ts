import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Services } from 'utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/entities/group.entity';
import { MemberGroup } from 'src/entities/member-group.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, MemberGroup]), UsersModule],
  controllers: [GroupController],
  providers: [
    {
      provide: Services.GROUP,
      useClass: GroupService,
    },
    {
      provide: Services.USER,
      useClass: UserService,
    },
  ],
})
export class GroupModule {}
