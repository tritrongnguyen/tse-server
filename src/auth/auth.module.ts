import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from 'utils/type';
import { UsersModule } from 'src/users/user.module';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
  imports: [UsersModule],
})
export class AuthModule {}
