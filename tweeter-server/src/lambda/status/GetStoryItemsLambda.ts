import { PagedStoryItemRequest, PagedStoryItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import DynamoFactory from "../../database-access/dynamoDB/DynamoFactory";

export const handler = async (
  request: PagedStoryItemRequest
): Promise<PagedStoryItemResponse> => {
  const statusService = new StatusService(new DynamoFactory());
  const [items, hasMore] = await statusService.loadMoreStoryItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: undefined,
    items: items,
    hasMore: hasMore,
  };
};
