import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/auth/auth.module';
import { Services } from 'utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/auth/entities/role.entity';
import { AccessGrant } from 'src/auth/entities/access-grant';
import { UsersModule } from 'src/users/user.module';

@Module({
  controllers: [AdminController],
  providers: [
    {
      provide: Services.ADMIN,
      useClass: AdminService,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([Role, AccessGrant]),
    AuthModule,
    UsersModule,
  ],
})
export class AdminModule {}
