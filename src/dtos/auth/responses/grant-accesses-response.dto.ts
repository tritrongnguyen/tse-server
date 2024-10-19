import { AccessGrant } from 'src/entities/access-grant.entity';

export class GrantAccessesResponse {
  grantAccesses: AccessGrant[];
  constructor(grantAccesses: AccessGrant[]) {
    this.grantAccesses = grantAccesses;
  }
}
