import { LogOutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: LogOutRequest
): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.logout(request.token);

  return {
    success: true,
    message: undefined,
  };
};
