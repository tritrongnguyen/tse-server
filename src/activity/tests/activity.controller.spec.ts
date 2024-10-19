import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from '../activity.controller';
import { ActivityService } from '../activity.service';
import { Services } from 'utils/constants';
import { IActivityService } from '../activity.interface.service';
import { Activity } from 'src/entities/activity.entity';
import {
  ActivityScope,
  ActivityStatus,
  ActivityType,
} from 'src/entities/enums/activity.enum';
import { CreateActivityRequest } from 'src/dtos/activity/requests/create-activity-request.dto';
import { Guards } from 'utils/security-constants';
import { HttpExceptionFilter } from 'utils/http-exception-filter';

describe('ActivityController', () => {
  let activityController: ActivityController;
  let activityService: IActivityService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: Services.ACTIVITY,
          useClass: ActivityService,
        },
      ],
    })
      .overrideGuard(Guards.AUTHENTICATION)
      .useValue({ canActivate: () => true })
      .overrideGuard(Guards.AUTHORIZATION)
      .useValue({ canActivate: () => true })
      .overrideFilter(HttpExceptionFilter)
      .useClass(HttpExceptionFilter)
      .compile();

    activityController = moduleRef.get<ActivityController>(ActivityController);
    activityService = moduleRef.get<ActivityService>(Services.ACTIVITY);
  });

  it('controller defined', () => {
    expect(activityController).toBeDefined();
  });

  it('service defined', () => {
    expect(activityService).toBeDefined();
  });

  describe('create activity', () => {
    it('return an activity', async () => {
      const createActivityRequest: CreateActivityRequest =
        new CreateActivityRequest(
          'title',
          'description',
          10,
          new Date(),
          new Date(),
          new Date(),
          'venue',
          ActivityType.CONTEST,
          ActivityStatus.CANCEL,
          ActivityScope.INTERNAL,
        );
      const expected = Promise.resolve(
        new Activity(
          'title',
          'description',
          10,
          new Date(),
          new Date(),
          new Date(),
          'venue',
          ActivityType.CONTEST,
          ActivityStatus.CANCEL,
          ActivityScope.INTERNAL,
        ),
      );

      jest
        .spyOn(activityService, 'createActivity')
        .mockImplementation(() => expected);

      expect(
        await activityController.createActivity(createActivityRequest),
      ).toBe(expected);
    });
  });
});
