import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import DynamoFactory from "../../database-access/dynamoDB/DynamoFactory";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService(new DynamoFactory());
  const foundUser = await userService.getUser(request.token, request.alias);

  return {
    success: true,
    message: undefined,
    user: foundUser,
  };
};
