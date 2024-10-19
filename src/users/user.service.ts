import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResponse } from 'src/dtos/common.dto';
import { ApproveLeftRequest } from 'src/dtos/users/requests/approve-left-request.dto';
import { ApproveRegisterRequest } from 'src/dtos/users/requests/approve-register-request.dto';
import { CreateUserRequest } from 'src/dtos/users/requests/create-user-request.dto';
import { AccessGrant } from 'src/entities/access-grant.entity';
import { UserStatus } from 'src/entities/enums/user.enum';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { SortDirections } from 'utils/constants';
import { Roles } from 'utils/security-constants';
import { User } from '../entities/user.entity';
import { IUserService } from './user.interface.service';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(AccessGrant)
    private accessGrantRepository: Repository<AccessGrant>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getUserInfoById(userId: string): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: { userId },
    });

    if (!userFound)
      throw new NotFoundException(`User with this ID ${userId} not found`);

    return userFound;
  }

  async getAllUsersPaginated(
    pageNum: number,
    pageSize: number,
    sortDirection: SortDirections,
    sortBy?: keyof User,
  ): Promise<PaginatedResponse<Partial<User>>> {
    const startIndex = (pageNum - 1) * pageSize;

    const [data, count] = await this.userRepository.findAndCount({
      skip: startIndex,
      take: pageSize,
      order: {
        [sortBy]: sortDirection,
      },
    });
    const pageable = Math.ceil(count / pageSize);

    if (count < startIndex)
      return new PaginatedResponse<User>(pageable, count, []);
    else {
      const result = data.map((d) => instanceToPlain(d));
      return new PaginatedResponse<Partial<User>>(pageable, count, result);
    }
  }

  async createUser(createUserRequest: CreateUserRequest): Promise<User> {
    const { userId, email, firstName, hashedPassword, lastName, status } =
      createUserRequest;

    const isExisted = await this.userRepository.exists({
      where: [{ userId }, { email }],
    });

    if (isExisted)
      throw new ConflictException(
        `User with ID ${userId} or email ${email} already existed!`,
      );

    return await this.userRepository.save(
      new User(userId, hashedPassword, firstName, lastName, email, status),
    );
  }

  async updateUser(user: User): Promise<User> {
    const isExisted = await this.userRepository.exists({
      where: {
        userId: user.userId,
      },
    });

    if (!isExisted)
      throw new NotFoundException(
        `User with ID ${user.userId} doesn't existed`,
      );

    return await this.userRepository.save(user);
  }

  async checkEmailExisted(email: string): Promise<boolean> {
    return await this.userRepository.exists({
      where: { email: email },
    });
  }

  async checkUserIdExisted(userId: string): Promise<boolean> {
    return await this.userRepository.exists({
      where: { userId: userId },
    });
  }

  async findUserById(userId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });
  }

  async getRegisterUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        status: UserStatus.PENDING_APPROVAL,
      },
      order: {
        registerDate: SortDirections.DESC,
      },
    });
  }

  async getLeftRequest(): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        status: UserStatus.LEFT_REQUESTING,
      },
      order: {
        registerDate: SortDirections.DESC,
      },
    });
  }

  // Missing handle id user id not existed in register request
  async approveRegisterRequest(
    approveRegisterRequest: ApproveRegisterRequest,
  ): Promise<boolean> {
    const { userIds } = approveRegisterRequest;

    const { affected } = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ status: UserStatus.ACTIVE, registerDate: new Date() })
      .where('userId IN (:...userIds)', { userIds })
      .execute();

    if (affected <= 0) return false;

    //Assign MEMBER role for all the register request user after change user status to ACTIVE
    const startRole = await this.roleRepository.findOne({
      where: {
        roleName: Roles.MEMBER,
      },
    });

    const accessGrants = userIds.map((userId) => {
      return new AccessGrant(
        { userId } as User,
        startRole,
        true,
        'Assigned MEMBER role upon registration approval',
      );
    });

    const grantAccesses = await this.accessGrantRepository.save(accessGrants);

    return grantAccesses.length > 0;
  }

  // User later for send mail
  // private async handlePostApproval(userIds: string[]): Promise<void> {
  //   try {
  //     // Example: Send welcome emails
  //     await this.emailService.sendWelcomeEmails(userIds);

  //     // Example: Create default resources for approved users
  //     await this.resourceService.createDefaultResources(userIds);
  //   } catch (error) {
  //     this.logger.error(`Error in post-approval handling: ${error.message}`);
  //     // Don't throw here, log and continue
  //   }
  // }

  async approveLeftRequest(
    approveLeftRequest: ApproveLeftRequest,
  ): Promise<void> {
    const { userIds } = approveLeftRequest;

    this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ status: UserStatus.TERMINATED })
      .where('userId IN (:...userIds)', { userIds })
      .execute();
  }
}
