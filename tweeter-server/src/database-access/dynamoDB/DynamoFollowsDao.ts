import { UserDto } from "tweeter-shared";
import { FollowsDao } from "../interfaces/FollowsDao";

export default class DynamoFollowsDao extends FollowsDao {
  public async getPageOfFollowers(
    lastItem: UserDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[UserDto[], boolean]> {
    throw new Error("Method not implemented.");
  }
  public async getPageOfFollowees(
    lastItem: UserDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[UserDto[], boolean]> {
    throw new Error("Method not implemented.");
  }
  public async deleteFollowItem(
    currentUserAlias: string,
    userToUnfollow: UserDto
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public async followeeCount(userToCountFollowees: UserDto): Promise<number> {
    throw new Error("Method not implemented.");
  }
  public async followerCount(userToCountFollowers: UserDto): Promise<number> {
    throw new Error("Method not implemented.");
  }
  public async makeFollowItem(
    currentUserAlias: string,
    userToFollow: UserDto
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public async getIsFollowerStatus(
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
