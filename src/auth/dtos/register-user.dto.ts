import {
  IsNotEmpty,
  IsNumber,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @IsNumber()
  @Matches(/^[0-9]{8}$/, {
    message: 'userId must be from 00000000 to 99999999',
  })
  userId: number;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  email: string;

  @MaxLength(11)
  @MinLength(10)
  phoneNumber: string;

  @IsNotEmpty()
  @MaxLength(32)
  firstName: string;

  @MaxLength(32)
  @IsNotEmpty()
  lastName: string;
}
