import { RegisterRequest, SignInResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import DynamoFactory from "../../database-access/dynamoDB/DynamoFactory";

export const handler = async (
  request: RegisterRequest
): Promise<SignInResponse> => {
  const userService = new UserService(new DynamoFactory());
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.imageString,
    request.imageExtension
  );

  return {
    success: true,
    message: undefined,
    user: user,
    token: authToken,
  };
};
