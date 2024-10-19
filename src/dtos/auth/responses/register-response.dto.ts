import { UserStatus } from 'src/entities/enums/user.enum';

export type RegisterResponseData = {
  userId: string;
  status: UserStatus;
};

export class RegisterResponse {
  register: RegisterResponseData;
  constructor(register: RegisterResponseData) {
    this.register = register;
  }
}
