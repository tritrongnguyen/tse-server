import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CheckUserExistRequest {
  @IsNotEmpty()
  @Matches(/^[0-9]{8}$/, {
    message: 'userId must be from 00000000 to 99999999',
  })
  userId: string;
  @IsNotEmpty()
  @MinLength(6)
  email: string;
}
