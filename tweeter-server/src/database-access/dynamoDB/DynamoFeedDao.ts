import { StatusDto } from "tweeter-shared";
import { FeedDao } from "../interfaces/FeedDao";

export default class DynamoFeedDao extends FeedDao {
  public async postStatusToFeed(post: StatusDto): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public async getPageOfItems(
    lastItem: StatusDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    throw new Error("Method not implemented.");
  }
}
