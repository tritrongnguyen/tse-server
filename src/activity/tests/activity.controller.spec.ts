import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from '../activity.controller';
import { ActivityService } from '../activity.service';
import { IActivityService } from '../activity.interface.service';

import { Services } from '../../../utils/constants';
import { Activity } from '../../entities/activity.entity';
import { HttpExceptionFilter } from '../../../utils/http-exception-filter';
import { Guards } from '../../../utils/security-constants';
import { CreateActivityRequest } from '../../dtos/activity/requests/create-activity-request.dto';
import {
  ActivityType,
  ActivityStatus,
  ActivityScope,
} from '../../entities/enums/activity.enum';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { verify } from 'crypto';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';

describe('ActivityController', () => {
  let activityController: ActivityController;
  let activityService: IActivityService;
  let activityRepository: Repository<Activity>;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: Services.ACTIVITY,
          useClass: ActivityService,
        },
        {
          provide: getRepositoryToken(Activity),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            exists: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
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
    activityRepository = moduleRef.get<Repository<Activity>>(
      getRepositoryToken(Activity),
    );
  });

  it('controller defined', () => {
    expect(activityController).toBeDefined();
  });

  it('service defined', () => {
    expect(activityService).toBeDefined();
  });

  // describe('create activity', () => {
  //   it('return an activity', async () => {
  //     const createActivityRequest: CreateActivityRequest =
  //       new CreateActivityRequest(
  //         'title',
  //         'description',
  //         10,
  //         new Date(),
  //         new Date(),
  //         new Date(),
  //         'venue',
  //         ActivityType.CONTEST,
  //         ActivityStatus.CANCEL,
  //         ActivityScope.INTERNAL,
  //       );
  //     const expected = Promise.resolve(
  //       new Activity(
  //         'title',
  //         'description',
  //         10,
  //         new Date(),
  //         new Date(),
  //         new Date(),
  //         'venue',
  //         ActivityType.CONTEST,
  //         ActivityStatus.CANCEL,
  //         ActivityScope.INTERNAL,
  //       ),
  //     );

  //     jest
  //       .spyOn(activityService, 'createActivity')
  //       .mockImplementation(() => expected);

  //     expect(
  //       await activityController.createActivity(createActivityRequest),
  //     ).toBe(expected);
  //   });
  // });
});
