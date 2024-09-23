import { Role } from 'src/auth/entities/role.entity';
import { AddRoleDTO } from './dtos/add-role.dto';
import { RoleGrant } from 'src/auth/entities/role-grant';
import { GrantRolesDTO } from './dtos/grant-roles.dto';

export interface IAdminService {
  addRole(addRoleDto: AddRoleDTO): Promise<Role>;
  grantRolesToUser(
    userId: string,
    grantRoleDto: GrantRolesDTO,
  ): Promise<RoleGrant[]>;
}
