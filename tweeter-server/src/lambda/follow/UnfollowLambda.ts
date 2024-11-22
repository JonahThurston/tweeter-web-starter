import {
  ChangeFollowStatusRequest,
  ChangeFollowStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import DynamoFactory from "../../database-access/dynamoDB/DynamoFactory";

export const handler = async (
  request: ChangeFollowStatusRequest
): Promise<ChangeFollowStatusResponse> => {
  const followService = new FollowService(new DynamoFactory());
  const [followerCount, followeeCount] = await followService.unfollow(
    request.token,
    request.user
  );

  return {
    success: true,
    message: undefined,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
