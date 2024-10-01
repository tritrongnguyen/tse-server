import { Role } from 'src/auth/entities/role.entity';
import { AddRoleDTO } from './dtos/add-role.dto';
import { GrantRolesDTO } from './dtos/grant-roles.dto';
import { AccessGrant } from 'src/auth/entities/access-grant';
import GrantAccessesRequestDTO from '../dtos/auth/requests/grant-accesses-request.dto';
import GrantAccessesResponseDTO from '../dtos/auth/responses/grant-accesses-response.dto';

export interface IAdminService {
  grantAccess(
    grantAccessesRequestDto: GrantAccessesRequestDTO,
  ): Promise<GrantAccessesResponseDTO>;
}
