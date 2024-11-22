import { LogOutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import DynamoFactory from "../../database-access/dynamoDB/DynamoFactory";

export const handler = async (
  request: LogOutRequest
): Promise<TweeterResponse> => {
  const userService = new UserService(new DynamoFactory());
  await userService.logout(request.token);

  return {
    success: true,
    message: undefined,
  };
};
