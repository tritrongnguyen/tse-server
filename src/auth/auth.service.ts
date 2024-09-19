import { Injectable } from '@nestjs/common';
import { IAuthService } from './auth.interface.service';

@Injectable()
export class AuthService implements IAuthService{
    validateUser(): void {
        throw new Error('Method not implemented.');
    }
}
