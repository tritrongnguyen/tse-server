import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from 'utils/type';

@Module({
  controllers: [AuthController],
  providers: [{
    provide: Services.AUTH,
    useClass: AuthService,
  }]
})
export class AuthModule { }
