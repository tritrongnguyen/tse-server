import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { Services } from 'utils/constants';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entities/user.entity';
import { AccessGrant } from 'src/entities/access-grant';
import { Role } from 'src/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AccessGrant, Role])],
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
