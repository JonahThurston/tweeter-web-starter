import {
  AuthToken,
  User,
  ChangeFollowStatusRequest,
  FollowCountRequest,
  GetFollowerStatusRequest,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";
import { PagedUserItemRequest } from "tweeter-shared";

export class FollowService {
  private server: ServerFacade = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    let request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.server.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    let request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.server.getMoreFollowees(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    let request: ChangeFollowStatusRequest = {
      token: authToken.token,
      user: userToUnfollow.dto,
    };
    return await this.server.unfollow(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    let request: FollowCountRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return await this.server.getFollowerCount(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    let request: FollowCountRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return await this.server.getFolloweeCount(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    let request: ChangeFollowStatusRequest = {
      token: authToken.token,
      user: userToFollow.dto,
    };
    return await this.server.follow(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    let request: GetFollowerStatusRequest = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };
    let result = await this.server.getFollowerStatus(request);
    //console.log(result);
    return result;
  }
}
