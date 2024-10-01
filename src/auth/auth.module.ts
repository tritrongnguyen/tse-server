import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from 'utils/constants';
import { UsersModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntities } from './entities';
import { AuthenticationGuard } from './guards/authentication.guard';
import { Guards } from 'utils/security-constants';
import { AuthorizationGuard } from './guards/authorization.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature(authEntities),
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        },
      }),
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    {
      provide: Guards.AUTHENTICATION,
      useClass: AuthenticationGuard,
    },
    {
      provide: Guards.AUTHORIZATION,
      useClass: AuthorizationGuard,
    },
  ],
  exports: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    {
      provide: Guards.AUTHENTICATION,
      useClass: AuthenticationGuard,
    },
    {
      provide: Guards.AUTHORIZATION,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AuthModule {}
