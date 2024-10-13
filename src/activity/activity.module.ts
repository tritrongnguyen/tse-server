import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Services } from 'utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [
    {
      provide: Services.ACTIVITY,
      useClass: ActivityService,
    },
  ],
})
export class ActivityModule {}
