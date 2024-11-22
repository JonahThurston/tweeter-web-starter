import { UserDto } from "tweeter-shared";
import { UsersDao } from "../interfaces/UsersDao";

export default class DynamoUsersDao extends UsersDao {
  public async checkUserPassword(
    alias: string,
    password: string
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public async getUser(alias: string): Promise<UserDto | null> {
    throw new Error("Method not implemented.");
  }
  public async createUser(user: UserDto, password: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
