import { UserDto } from "tweeter-shared";

export abstract class UsersDao {
  abstract checkUserPassword(alias: string, password: string): Promise<boolean>;
  abstract getUser(alias: string): Promise<UserDto | null>;
  abstract createUser(user: UserDto, password: string): Promise<void>;
}
