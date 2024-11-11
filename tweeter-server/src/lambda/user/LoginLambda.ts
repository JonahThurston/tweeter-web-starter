import { LoginRequest, SignInResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: LoginRequest
): Promise<SignInResponse> => {
  const userService = new UserService();
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
