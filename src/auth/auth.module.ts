import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Guards, Services } from 'utils/constants';
import { UsersModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntities } from './entities';

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
        global: true,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    {
      provide: Guards.AUTH,
      useClass: AuthGuard,
    },
  ],
  // exports: [
  //   {
  //     provide: Guards.AUTH,
  //     useClass: AuthGuard,
  //   },
  // ],
})
export class AuthModule {}
