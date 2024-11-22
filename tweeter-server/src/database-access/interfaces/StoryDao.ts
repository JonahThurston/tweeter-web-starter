import { StatusDto } from "tweeter-shared";

export abstract class StoryDao {
  abstract postStatusToStory(post: StatusDto): Promise<void>;
  abstract getPageOfItems(
    lastItem: StatusDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[StatusDto[], boolean]>;
}
