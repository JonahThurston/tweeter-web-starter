import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import DynamoFactory from "../../database-access/dynamoDB/DynamoFactory";

export const handler = async (
  request: FollowCountRequest
): Promise<FollowCountResponse> => {
  const followService = new FollowService(new DynamoFactory());
  const followerCount = await followService.getFollowerCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: undefined,
    count: followerCount,
  };
};
