import { UserDto } from "tweeter-shared";
import { FollowsDao } from "../interfaces/FollowsDao";

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import DynamoUsersDao from "./DynamoUsersDao";

export default class DynamoFollowsDao extends FollowsDao {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerHandleAttr = "follower_handle";
  readonly followeeHandleAttr = "followee_handle";

  private readonly client;

  public constructor(client: DynamoDBDocumentClient) {
    super();
    this.client = client;
  }

  public async getPageOfFollowers(
    lastItem: UserDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[UserDto[], boolean]> {
    try {
      let lastFollowerHandle = lastItem?.alias;
      const params = {
        KeyConditionExpression: this.followeeHandleAttr + " = :fol",
        ExpressionAttributeValues: {
          ":fol": userAlias,
        },
        TableName: this.tableName,
        IndexName: this.indexName,
        Limit: pageSize,
        ExclusiveStartKey:
          lastFollowerHandle === undefined
            ? undefined
            : {
                [this.followerHandleAttr]: userAlias,
                [this.followeeHandleAttr]: lastFollowerHandle,
              },
      };

      const followerAliases: string[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) =>
        followerAliases.push(item[this.followeeHandleAttr])
      );

      let userDao = new DynamoUsersDao(this.client);
      const items: UserDto[] = [];
      for (const alias of followerAliases) {
        let retrievedUser = await userDao.getUser(alias);
        if (retrievedUser != null) {
          items.push(retrievedUser);
        }
      }

      return [items, hasMorePages];
    } catch (error) {
      throw new Error("[Server Error] get page of followers " + error);
    }
  }

  public async getPageOfFollowees(
    lastItem: UserDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[UserDto[], boolean]> {
    try {
      let lastFolloweeHandle = lastItem?.alias;
      const params = {
        KeyConditionExpression: this.followerHandleAttr + " = :fol",
        ExpressionAttributeValues: {
          ":fol": userAlias,
        },
        TableName: this.tableName,
        IndexName: this.indexName,
        Limit: pageSize,
        ExclusiveStartKey:
          lastFolloweeHandle === undefined
            ? undefined
            : {
                [this.followerHandleAttr]: userAlias,
                [this.followeeHandleAttr]: lastFolloweeHandle,
              },
      };

      const followeeAliases: string[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) =>
        followeeAliases.push(item[this.followeeHandleAttr])
      );

      let userDao = new DynamoUsersDao(this.client);
      const items: UserDto[] = [];
      for (const alias of followeeAliases) {
        let retrievedUser = await userDao.getUser(alias);
        if (retrievedUser != null) {
          items.push(retrievedUser);
        }
      }

      return [items, hasMorePages];
    } catch (error) {
      throw new Error("[Server Error] get page of followees " + error);
    }
  }

  public async deleteFollowItem(
    currentUserAlias: string,
    userToUnfollow: UserDto
  ): Promise<void> {
    try {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.followerHandleAttr]: currentUserAlias,
          [this.followeeHandleAttr]: userToUnfollow.alias,
        },
      };
      await this.client.send(new DeleteCommand(params));
    } catch (error) {
      throw new Error("Server Error delete follow item");
    }
  }

  public async followeeCount(userToCountFollowees: UserDto): Promise<number> {
    try {
      const params = {
        KeyConditionExpression: this.followerHandleAttr + " = :fol",
        ExpressionAttributeValues: {
          ":fol": userToCountFollowees.alias,
        },
        TableName: this.tableName,
        IndexName: this.indexName,
      };

      const data = await this.client.send(new QueryCommand(params));
      if (!data.Items || data.Items.length === 0) {
        return 0;
      } else {
        return data.Items.length;
      }
    } catch (error) {
      throw new Error("[Server Error] followee Count " + error);
    }
  }

  public async followerCount(userToCountFollowers: UserDto): Promise<number> {
    try {
      const params = {
        KeyConditionExpression: this.followeeHandleAttr + " = :fol",
        ExpressionAttributeValues: {
          ":fol": userToCountFollowers.alias,
        },
        TableName: this.tableName,
        IndexName: this.indexName,
      };

      const data = await this.client.send(new QueryCommand(params));
      if (!data.Items || data.Items.length === 0) {
        return 0;
      } else {
        return data.Items.length;
      }
    } catch (error) {
      throw new Error("[Server Error] follower Count " + error);
    }
  }

  public async makeFollowItem(
    currentUserAlias: string,
    userToFollow: UserDto
  ): Promise<void> {
    try {
      let userToFollowAlias = userToFollow.alias;
      const params = {
        TableName: this.tableName,
        Item: {
          [this.followerHandleAttr]: currentUserAlias,
          [this.followeeHandleAttr]: userToFollowAlias,
        },
      };
      await this.client.send(new PutCommand(params));
    } catch (error) {
      throw new Error("[Server Error] Make follow item " + error);
    }
  }

  public async getIsFollowerStatus(
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    try {
      const params = {
        KeyConditionExpression:
          this.followerHandleAttr +
          " = :fol AND " +
          this.followeeHandleAttr +
          " = :folee",
        ExpressionAttributeValues: {
          ":fol": user.alias,
          ":folee": selectedUser.alias,
        },
        TableName: this.tableName,
      };

      const data = await this.client.send(new QueryCommand(params));

      return data.Items != undefined && data.Items.length > 0;
    } catch (error) {
      throw new Error("[Server Error] get is follower status " + error);
    }
  }

  public async getAllFollowers(alias: string): Promise<string[]> {
    try {
      const params = {
        KeyConditionExpression: this.followeeHandleAttr + " = :fol",
        ExpressionAttributeValues: {
          ":fol": alias,
        },
        TableName: this.tableName,
        IndexName: this.indexName,
      };

      let followerAliases: string[] = [];
      const data = await this.client.send(new QueryCommand(params));
      data.Items?.forEach((item) => {
        followerAliases.push(item[this.followerHandleAttr]);
      });

      return followerAliases;
    } catch (error) {
      throw new Error("[Server Error] getting all followers " + error);
    }
  }
}
