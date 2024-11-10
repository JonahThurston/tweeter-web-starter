import {
  ChangeFollowStatusRequest,
  ChangeFollowStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: ChangeFollowStatusRequest
): Promise<ChangeFollowStatusResponse> => {
  const followService = new FollowService();
  const [followerCount, followeeCount] = await followService.follow(
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
