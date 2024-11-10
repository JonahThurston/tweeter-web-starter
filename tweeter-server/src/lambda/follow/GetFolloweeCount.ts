import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: FollowCountRequest
): Promise<FollowCountResponse> => {
  const followService = new FollowService();
  const followeeCount = await followService.getFolloweeCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: undefined,
    count: followeeCount,
  };
};
