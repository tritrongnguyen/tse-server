import { Controller, Inject } from '@nestjs/common';
import { Routes, Services } from 'utils/type';
import { IAuthService } from './auth.interface.service';

@Controller(Routes.AUTH)
export class AuthController {

  constructor(@Inject(Services.AUTH) private readonly authService: IAuthService) {
  }

}
