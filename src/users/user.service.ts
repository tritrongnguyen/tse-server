import { Injectable } from '@nestjs/common';
import { IUserService } from './user.interface.service';

@Injectable()
export class UserService implements IUserService {
  createUser() {
    console.log('Call from user service');
  }
}
