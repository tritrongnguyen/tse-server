import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/auth/auth.module';
import { Services } from 'utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/auth/entities/role.entity';
import { RoleGrant } from 'src/auth/entities/role-grant';

@Module({
  controllers: [AdminController],
  providers: [
    {
      provide: Services.ADMIN,
      useClass: AdminService,
    },
  ],
  imports: [AuthModule, TypeOrmModule.forFeature([Role, RoleGrant])],
})
export class AdminModule {}
