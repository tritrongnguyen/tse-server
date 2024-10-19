import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    example: 'admin',
    description: 'userId existed in the system',
  })
  @IsNotEmpty()
  @Matches(/^(?:[0-9]{8}|admin)$/, {
    message: 'userId must be from 00000000 to 99999999',
  })
  userId: string;

  @ApiProperty({
    example: 'administrator',
    description: 'password of the user',
  })
  @IsNotEmpty()
  password: string;
}
