import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IGroupService } from './group.interface.service';
import { Group } from 'src/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Like,
  Repository,
  DataSource,
  UpdateResult,
  In,
  DeleteResult,
} from 'typeorm';
import { Services, SortDirections } from 'utils/constants';
import { PaginationQuery } from 'utils/helpers/request-helper';
import { CreateGroupRequestDTO } from 'src/dtos/groups/requests/create-group-request.dto';
import { MemberGroup } from 'src/entities/member-group.entity';
import { IUserService } from 'src/users/user.interface.service';
import { AddGroupMembersRequestDTO } from 'src/dtos/groups/requests/add-group-members-request.dto';
import { RemoveGroupMemberRequestDTO } from 'src/dtos/groups/requests/remove-group-member-request.dto';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(MemberGroup)
    private memberGroupRepository: Repository<MemberGroup>,

    @Inject(Services.USER) private userService: IUserService,
    private dataSource: DataSource,
  ) {}

  async getGroupByPartialName(partialName: string): Promise<Partial<Group>[]> {
    return await this.groupRepository.find({
      where: {
        groupName: Like(`%${partialName}%`),
      },
    });
  }

  async getAllGroupPaginated(paginatedQuery: PaginationQuery): Promise<{
    groups: Partial<Group>[];
    pageable: number;
  }> {
    const {
      page = 1,
      size = 10,
      sortBy = 'groupId',
      sortDirection = SortDirections.ASC,
    } = paginatedQuery || {};

    const startIndex = (page - 1) * size;

    const normalizeSortDirection =
      sortDirection.toLocaleLowerCase() === 'desc'
        ? SortDirections.DESC
        : (SortDirections.ASC ?? SortDirections.ASC);

    const [groups, count] = await this.groupRepository.findAndCount({
      skip: startIndex,
      take: size,
      order: {
        [sortBy]: normalizeSortDirection,
      },
    });
    const pageable = Math.ceil(count / size);

    if (count < startIndex)
      return {
        groups: [],
        pageable: 0,
      };
    else {
      return {
        groups,
        pageable,
      };
    }
  }

  async createGroup(createGroupDto: CreateGroupRequestDTO): Promise<Group> {
    // check group name is existed
    const isExisted = await this.groupRepository.exists({
      where: {
        groupName: createGroupDto.groupName,
      },
    });

    if (isExisted) {
      throw new ConflictException('Group already existed');
    }

    const leader = await this.userService.getUserInfoById(
      createGroupDto.leaderId,
    );

    const group: Partial<Group> = new Group();
    group.groupName = createGroupDto.groupName;
    group.description = createGroupDto.description ?? createGroupDto.groupName;
    group.leaderName = `${leader.firstName} ${leader.lastName}`;
    group.memberNum = createGroupDto.memberIds.length + 1;

    const newGroup = await this.groupRepository.save(group);
    const leaderGroup = new MemberGroup();
    leaderGroup.member = leader;
    leaderGroup.group = newGroup;

    await Promise.all([
      this.memberGroupRepository.save({
        member: leader,
        group: newGroup,
        isLeader: true,
      }),
      ...createGroupDto.memberIds.map(async (memberId) =>
        this.memberGroupRepository.save({
          member: await this.userService.getUserInfoById(memberId),
          group: newGroup,
        }),
      ),
    ]);

    return newGroup;
  }

  async getAllMemberOfGroup(grId: number): Promise<Partial<MemberGroup>[]> {
    const isExisted = await this.groupRepository.exists({
      where: {
        groupId: grId,
      },
    });

    if (!isExisted) {
      throw new NotFoundException('Group not existed');
    }

    const result = await this.memberGroupRepository
      .createQueryBuilder('mg')
      .where('mg.group_id = :grId', { grId })
      .getMany();

    return result;
  }

  async getGroupInformation(groupId: number): Promise<Partial<Group>> {
    const group = await this.groupRepository.findOne({
      where: {
        groupId,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not existed');
    }

    return group;
  }

  async changeGroupLeader(groupId: number, userId: string): Promise<boolean> {
    const groupExisted = await this.groupRepository.findOne({
      where: {
        groupId,
      },
    });

    if (!groupExisted) {
      throw new NotFoundException('Group not existed');
    }

    const userToBeLeader = await this.memberGroupRepository
      .createQueryBuilder('mg')
      .where('mg.group_id = :groupId', { groupId })
      .andWhere('mg.user_id = :userId', { userId })
      .andWhere('mg.is_leader = false')
      .getOne();

    if (!userToBeLeader) {
      throw new NotFoundException(
        'The user is either not in the group or is already a leader!',
      );
    }
    let updateResult: UpdateResult;
    await this.dataSource.transaction(async (transactionManager) => {
      await transactionManager.update(
        MemberGroup,
        {
          group: { groupId },
          isLeader: true,
        },
        {
          isLeader: false,
        },
      );

      updateResult = await transactionManager.update(
        MemberGroup,
        {
          group: { groupId },
          member: { userId },
        },
        {
          isLeader: true,
        },
      );
    });

    if (updateResult.affected === 0) {
      throw new InternalServerErrorException('Change leader failed');
    } else {
      return true;
    }
  }

  async addMembersToGroup(
    groupId: number,
    addGroupMemberRequest: AddGroupMembersRequestDTO,
  ): Promise<Partial<MemberGroup>[]> {
    return this.dataSource.transaction(async (transactionManager) => {
      const usersAdded: Partial<MemberGroup>[] = [];
      const { userIds } = addGroupMemberRequest;
      for (const userId of userIds) {
        const isExisted = await transactionManager
          .createQueryBuilder(MemberGroup, 'mg')
          .where('mg.group_id = :groupId', { groupId })
          .andWhere('mg.user_id = :userId', { userId })
          .getExists();

        if (isExisted) {
          throw new ConflictException(
            `Member with userId ${userId} already exists in the group`,
          );
        }

        const userAdded = await transactionManager.save(MemberGroup, {
          group: { groupId },
          member: { userId },
        });

        usersAdded.push(userAdded);
      }

      await transactionManager.increment(
        Group,
        { groupId },
        'memberNum',
        userIds.length,
      );

      return usersAdded;
    });
  }

  removeMembersFromGroup(
    groupId: number,
    removeGroupMemberRequest: RemoveGroupMemberRequestDTO,
  ): Promise<boolean> {
    return this.dataSource.transaction(async (transactionManager) => {
      const { userIds } = removeGroupMemberRequest;
      const groupExisted = await transactionManager.findOne(Group, {
        where: { groupId },
      });

      if (!groupExisted) {
        throw new NotFoundException(`Group with ID ${groupId} not found`);
      } else if (groupExisted.memberNum - userIds.length < 3) {
        throw new BadRequestException('Group must have at least 3 members');
      }

      for (const userId of userIds) {
        const userExisted = await transactionManager
          .createQueryBuilder(MemberGroup, 'mg')
          .where('mg.group_id = :groupId', { groupId })
          .andWhere('mg.user_id = :userId', { userId })
          .getOne();

        if (!userExisted)
          throw new NotFoundException(
            `Member with userId ${userId} does not exist in the group`,
          );

        if (userExisted.isLeader)
          throw new BadRequestException(
            `Cannot remove the group leader (${userId})`,
          );

        await transactionManager
          .createQueryBuilder()
          .delete()
          .from(MemberGroup)
          .where('group_id = :groupId', { groupId })
          .andWhere('user_id = :userId', { userId })
          .execute();
      }

      groupExisted.memberNum -= userIds.length;
      await transactionManager.save(groupExisted);

      return true;
    });
  }
}
