import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { Services } from 'utils/type';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: Services.USER,
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: Services.USER,
      useClass: UserService,
    },
  ],
})
export class UsersModule {}
