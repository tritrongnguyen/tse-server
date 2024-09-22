import { IsNotEmpty, Matches } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @Matches(/^[0-9]{8}$/, {
    message: 'userId must be from 00000000 to 99999999',
  })
  userId: string;

  @IsNotEmpty()
  password: string;
}
