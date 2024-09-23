import { ConflictException, Injectable } from '@nestjs/common';
import { IAdminService } from './admin.interface.service';
import { Role } from 'src/auth/entities/role.entity';
import { AddRoleDTO } from './dtos/add-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
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
}
