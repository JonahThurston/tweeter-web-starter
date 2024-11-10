import {
  AuthToken,
  Status,
  FakeData,
  PagedStoryItemRequest,
  PostStatusRequest,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {
  private server: ServerFacade = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    let request: PagedStoryItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.server.getMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    let request: PagedStoryItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.server.getMoreStoryItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    let request: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus,
    };
    return await this.server.postStatus(request);
  }
}
