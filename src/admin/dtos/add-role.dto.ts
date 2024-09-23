import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AddRoleDTO {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  roleName: string;

  @IsNotEmpty()
  @MinLength(1)
  description: string;
}
