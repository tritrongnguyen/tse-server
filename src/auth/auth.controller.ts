import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'utils/constants';
import { IAuthService } from './auth.interface.service';
import { RegisterUserDTO } from './dtos/register-user.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Get('hello')
  public helloworld() {
    return 'Hello world!';
  }

  @Post('register')
  public registerUser(@Body() registerUserDTO: RegisterUserDTO) {
    try {
      return this.authService.register(registerUserDTO);
    } catch (error) {
      console.error(error.message);
    }
  }
}
