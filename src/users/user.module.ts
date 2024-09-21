import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { Services } from 'utils/constants';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntities } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature(userEntities)],
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
    TypeOrmModule,
  ],
})
export class UsersModule {}
