import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 20082681,
    description: "The user's id",
  })
  @IsNotEmpty()
  @Matches(/^[0-9]{8}$/, {
    message: 'userId must be from 00000000 to 99999999',
  })
  userId: string;

  @ApiProperty({
    example: 'sup3rS3cretPa$$word',
    description: `User's password`,
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  hashedPassword: string;

  @ApiProperty({
    example: 'user@example.com',
    description: `User's email`,
  })
  @IsNotEmpty()
  @MinLength(6)
  email: string;

  @ApiProperty({
    example: 'Doe',
    description: "User's first name",
  })
  @IsNotEmpty()
  @MaxLength(32)
  firstName: string;

  @ApiProperty({
    example: 'John',
    description: "User's last name",
  })
  @MaxLength(32)
  @IsNotEmpty()
  lastName: string;
}
