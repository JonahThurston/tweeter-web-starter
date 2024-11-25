import { AuthTokenDto } from "tweeter-shared";
import { SessionsDao } from "../interfaces/SessionsDao";

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

export default class DynamoSessionsDao extends SessionsDao {
  readonly tableName = "sessions";
  readonly tokenAttr = "token";
  readonly aliasAttr = "alias";
  readonly timestampAttr = "mytimestamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async checkToken(token: string): Promise<string | null> {
    try {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.tokenAttr]: token,
        },
      };

      const { Item } = await this.client.send(new GetCommand(params));
      if (Item === undefined || Item[this.tokenAttr] != token) {
        return null;
      }

      const retrievedTimestamp = Item[this.timestampAttr];
      const currTime = Date.now();
      //currently set to 5 minute time out
      if (currTime - retrievedTimestamp > 300000) {
        await this.deleteSession(token);
        return null;
      } else {
        await this.resetTimestamp(token);
        return Item[this.aliasAttr];
      }
    } catch (error) {
      throw new Error("[Server Error] check token " + error);
    }
  }

  public async makeNewSession(alias: string): Promise<AuthTokenDto> {
    try {
      const newToken = uuidv4();
      const currTime = Date.now();
      const params = {
        TableName: this.tableName,
        Item: {
          [this.aliasAttr]: alias,
          [this.tokenAttr]: newToken,
          [this.timestampAttr]: currTime,
        },
      };

      await this.client.send(new PutCommand(params));

      return {
        token: newToken,
        timestamp: currTime,
      };
    } catch (error) {
      throw new Error("[Server Error] Create session");
    }
  }

  public async deleteSession(token: string): Promise<void> {
    try {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.tokenAttr]: token,
        },
      };

      await this.client.send(new DeleteCommand(params));
    } catch (error) {
      throw new Error("[Server Error] delete session " + error);
    }
  }

  private async resetTimestamp(token: string): Promise<void> {
    try {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.tokenAttr]: token,
        },
        ExpressionAttributeValues: { ":inc": Date.now() },
        UpdateExpression: "SET " + this.timestampAttr + " = :inc",
      };
      await this.client.send(new UpdateCommand(params));
    } catch (error) {
      throw new Error("[Server Error] reseting session timestamp " + error);
    }
  }
}
