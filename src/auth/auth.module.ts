import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Guards, Services } from 'utils/constants';
import { UsersModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntities } from './entities';
import { AuthenticationGuard } from './guards/authentication.guard';

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
  ],
})
export class AuthModule {}
