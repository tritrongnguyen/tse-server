import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class GrantRolesDTO {
  @IsNotEmpty()
  @ArrayNotEmpty()
  roleIds: number[];
}
