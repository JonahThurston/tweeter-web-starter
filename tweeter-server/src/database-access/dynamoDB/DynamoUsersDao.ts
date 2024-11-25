import { UserDto } from "tweeter-shared";
import { UsersDao } from "../interfaces/UsersDao";
import bcrypt from "bcryptjs";

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export default class DynamoUsersDao extends UsersDao {
  readonly tableName = "users";
  readonly aliasAttr = "alias";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly passwordAttr = "password";
  readonly imageUrlAttr = "image_url";

  private readonly client;
  public constructor(client: DynamoDBDocumentClient) {
    super();
    this.client = client;
  }

  public async checkUserPassword(
    alias: string,
    password: string
  ): Promise<boolean> {
    try {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.aliasAttr]: alias,
        },
      };

      const { Item } = await this.client.send(new GetCommand(params));
      if (Item === undefined) {
        return false;
      } else {
        const retrievedPassword = Item[this.passwordAttr];
        return bcrypt.compareSync(password, retrievedPassword);
      }
    } catch (error) {
      throw new Error("[Server Error] check user password");
    }
  }

  public async getUser(alias: string): Promise<UserDto | null> {
    try {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.aliasAttr]: alias,
        },
      };

      const { Item } = await this.client.send(new GetCommand(params));
      if (Item === undefined) {
        return null;
      } else {
        return {
          firstName: Item[this.firstNameAttr],
          lastName: Item[this.lastNameAttr],
          alias: Item[this.aliasAttr],
          imageUrl: Item[this.imageUrlAttr],
        };
      }
    } catch (error) {
      throw new Error("[Server Error] get user");
    }
  }

  public async createUser(user: UserDto, password: string): Promise<void> {
    try {
      const encryptedPassword = bcrypt.hashSync(password, 10);

      const params = {
        TableName: this.tableName,
        Item: {
          [this.aliasAttr]: user.alias,
          [this.firstNameAttr]: user.firstName,
          [this.lastNameAttr]: user.lastName,
          [this.passwordAttr]: encryptedPassword,
          [this.imageUrlAttr]: user.imageUrl,
        },
      };

      await this.client.send(new PutCommand(params));
    } catch (error) {
      throw new Error("[Server Error] Create User");
    }
  }
}
