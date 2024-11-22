import { UserDto } from "tweeter-shared";

export abstract class FollowsDao {
  abstract getPageOfFollowers(
    lastItem: UserDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[UserDto[], boolean]>;

  abstract getPageOfFollowees(
    lastItem: UserDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[UserDto[], boolean]>;

  abstract deleteFollowItem(
    currentUserAlias: string,
    userToUnfollow: UserDto
  ): Promise<void>;

  abstract followeeCount(userToCountFollowees: UserDto): Promise<number>;
  abstract followerCount(userToCountFollowers: UserDto): Promise<number>;

  abstract makeFollowItem(
    currentUserAlias: string,
    userToFollow: UserDto
  ): Promise<void>;

  abstract getIsFollowerStatus(
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean>;
}
