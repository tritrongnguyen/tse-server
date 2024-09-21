import { Controller, Inject } from '@nestjs/common';
import { Routes, Services } from 'utils/type';
import { IUserService } from './user.interface.service';

@Controller(Routes.USERS)
export class UserController {
  constructor(@Inject(Services.USER) userService: IUserService) {}
}
