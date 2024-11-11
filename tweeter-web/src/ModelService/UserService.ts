import { Buffer } from "buffer";
import {
  AuthToken,
  FakeData,
  GetUserRequest,
  LogOutRequest,
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
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
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
