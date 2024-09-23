import { Role } from 'src/auth/entities/role.entity';
import { AddRoleDTO } from './dtos/add-role.dto';

export interface IAdminService {
  addRole(addRoleDto: AddRoleDTO): Promise<Role>;
}
