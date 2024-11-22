import { StatusDto } from "tweeter-shared";

export abstract class FeedDao {
  abstract postStatusToFeed(post: StatusDto): Promise<void>;
  abstract getPageOfItems(
    lastItem: StatusDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[StatusDto[], boolean]>;
}
