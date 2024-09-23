import { ConflictException, Injectable } from '@nestjs/common';
import { IAdminService } from './admin.interface.service';
import { Role } from 'src/auth/entities/role.entity';
import { AddRoleDTO } from './dtos/add-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrantRolesDTO } from './dtos/grant-roles.dto';
import { RoleGrant } from 'src/auth/entities/role-grant';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(RoleGrant)
    private roleGrantRepository: Repository<RoleGrant>,
  ) {}

  async addRole(addRoleDto: AddRoleDTO): Promise<Role> {
    const roleExist = await this.roleRepository.exists({
      where: {
        roleName: addRoleDto.roleName,
      },
    });
    if (roleExist)
      throw new ConflictException('This role name already existed!!!');

    const newRole = new Role();
    newRole.roleName = addRoleDto.roleName;
    newRole.description = addRoleDto.description;

    return await this.roleRepository.save(newRole);
  }

  async grantRolesToUser(
    userId: string,
    grantRoleDtos: GrantRolesDTO,
  ): Promise<RoleGrant[]> {
    const rolesGrant: RoleGrant[] = [];
    grantRoleDtos.roleIds.forEach((role) => {
      const roleGrant = new RoleGrant();
      roleGrant.user = new User();
      roleGrant.role = new Role();
      roleGrant.user.userId = userId;
      roleGrant.role.roleId = role;
      rolesGrant.push(roleGrant);
    });

    return await this.roleGrantRepository.save(rolesGrant);
  }
}
