import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDTO {
  @IsNotEmpty()
  @Type(() => Number)
  userId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MinLength(100)
  rawPassword: string;

  role: Date;
}
