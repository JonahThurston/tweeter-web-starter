import {
  GetFollowerStatusRequest,
  GetFollowerStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: GetFollowerStatusRequest
): Promise<GetFollowerStatusResponse> => {
  const followService = new FollowService();
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: undefined,
    status: isFollower,
  };
};
