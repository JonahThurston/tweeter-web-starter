import { Buffer } from "buffer";
import {
  AuthToken,
  FakeData,
  GetUserRequest,
  LoginRequest,
  LogOutRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class UserService {
  private server: ServerFacade = new ServerFacade();

  public async logout(authToken: AuthToken): Promise<void> {
    let request: LogOutRequest = {
      token: authToken.token,
    };
    return await this.server.logout(request);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias: alias,
      password: password,
    };

    return await this.server.login(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    let request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      imageString: imageStringBase64,
      imageExtension: imageFileExtension,
    };

    return await this.server.register(request);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    let request: GetUserRequest = {
      token: authToken.token,
      alias: alias,
    };
    return await this.server.getUser(request);
  }
}
