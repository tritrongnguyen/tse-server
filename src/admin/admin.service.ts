import { Injectable } from '@nestjs/common';
import { IAdminService } from './admin.interface.service';
import GrantAccessesRequestDTO from '../dtos/auth/requests/grant-accesses-request.dto';
import GrantAccessesResponseDTO from '../dtos/auth/responses/grant-accesses-response.dto';

@Injectable()
export class AdminService implements IAdminService {
  grantAccess(
    grantAccessesRequestDto: GrantAccessesRequestDTO,
  ): Promise<GrantAccessesResponseDTO> {
    throw new Error('Method not implemented.');
  }
}
