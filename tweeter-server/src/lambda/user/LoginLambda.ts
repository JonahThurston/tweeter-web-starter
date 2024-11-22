import { LoginRequest, SignInResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import DynamoFactory from "../../database-access/dynamoDB/DynamoFactory";

export const handler = async (
  request: LoginRequest
): Promise<SignInResponse> => {
  const userService = new UserService(new DynamoFactory());
  const [user, authToken] = await userService.login(
    request.alias,
    request.password
  );

  return {
    success: true,
    message: undefined,
    user: user,
    token: authToken,
  };
};
