import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Services } from 'utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/entities/activity.entity';
import { User } from '../entities/user.entity';
import { UserActivity } from '../entities/user-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, User, UserActivity])],
  controllers: [ActivityController],
  providers: [
    {
      provide: Services.ACTIVITY,
      useClass: ActivityService,
    },
  ],
})
export class ActivityModule {}
