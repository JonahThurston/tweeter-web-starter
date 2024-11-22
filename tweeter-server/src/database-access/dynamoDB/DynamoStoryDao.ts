import { StatusDto } from "tweeter-shared";
import { StoryDao } from "../interfaces/StoryDao";

export default class DynamoStoryDao extends StoryDao {
  public async postStatusToStory(post: StatusDto): Promise<void> {
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
