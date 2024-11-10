import { PagedStoryItemRequest, PagedStoryItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PagedStoryItemRequest
): Promise<PagedStoryItemResponse> => {
  const statusService = new StatusService();
  const [items, hasMore] = await statusService.loadMoreFeedItems(
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
