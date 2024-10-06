import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './group/group.module';
import { ActivityModule } from './activity/activity.module';
import { AttendanceModule } from './attendance/attendance.module';
import { appEntities } from './entities';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.MYSQL_DB_NAME,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      synchronize: true,
      entities: appEntities,
    }),
    AuthModule,
    UsersModule,
    GroupModule,
    ActivityModule,
    AttendanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
