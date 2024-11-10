import {
  ChangeFollowStatusRequest,
  ChangeFollowStatusResponse,
  FollowCountRequest,
  FollowCountResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://ggndsq9exi.execute-api.us-west-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message);
    }
  }

  public async unfollow(
    request: ChangeFollowStatusRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      ChangeFollowStatusRequest,
      ChangeFollowStatusResponse
    >(request, "/unfollow");

    if (response.success) {
      if (response.followeeCount == null || response.followerCount == null) {
        throw new Error(`No followee or follower count found`);
      } else {
        return [response.followerCount, response.followeeCount];
      }
    } else {
      console.error(response);
      throw new Error(response.message);
    }
  }

  public async follow(
    request: ChangeFollowStatusRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      ChangeFollowStatusRequest,
      ChangeFollowStatusResponse
    >(request, "/follow");

    if (response.success) {
      if (response.followeeCount == null || response.followerCount == null) {
        throw new Error(`No followee or follower count found`);
      } else {
        return [response.followerCount, response.followeeCount];
      }
    } else {
      console.error(response);
      throw new Error(response.message);
    }
  }

  public async getFollowerCount(request: FollowCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/follower/count");

    if (response.success) {
      if (response.count == null) {
        throw new Error(`No count found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message);
    }
  }

  public async getFolloweeCount(request: FollowCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/followee/count");

    if (response.success) {
      if (response.count == null) {
        throw new Error(`No count found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message);
    }
  }
}
