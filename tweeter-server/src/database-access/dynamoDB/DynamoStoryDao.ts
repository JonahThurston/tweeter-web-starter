import { StatusDto } from "tweeter-shared";
import { StoryDao } from "../interfaces/StoryDao";

import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export default class DynamoStoryDao extends StoryDao {
  readonly tableName = "story";
  readonly authorAliasAttr = "author_alias";
  readonly timestampAttr = "timestamp";
  readonly postAttr = "post";
  readonly firstNameAttr = "firstName";
  readonly lastNameAttr = "lastName";
  readonly imageUrlAttr = "imageUrl";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async postStatusToStory(post: StatusDto): Promise<void> {
    try {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.authorAliasAttr]: post.user.alias,
          [this.timestampAttr]: post.timestamp,
          [this.postAttr]: post.post,
          [this.firstNameAttr]: post.user.firstName,
          [this.lastNameAttr]: post.user.lastName,
          [this.imageUrlAttr]: post.user.imageUrl,
        },
      };
      await this.client.send(new PutCommand(params));
    } catch (error) {
      throw new Error("[Server Error] Make story item " + error);
    }
  }

  public async getPageOfItems(
    lastItem: StatusDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    try {
      let lastPosterHandle = lastItem?.user.alias;
      const params = {
        KeyConditionExpression: this.authorAliasAttr + " = :fol",
        ExpressionAttributeValues: {
          ":fol": userAlias,
        },
        TableName: this.tableName,
        Limit: pageSize,
        ExclusiveStartKey:
          lastPosterHandle === undefined
            ? undefined
            : {
                [this.authorAliasAttr]: lastItem?.user.alias,
                [this.timestampAttr]: lastItem?.timestamp,
              },
        ScanIndexForward: false,
      };
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;

      const statuses: StatusDto[] = [];
      data.Items?.forEach((item) =>
        statuses.push({
          post: item[this.postAttr],
          user: {
            firstName: item[this.firstNameAttr],
            lastName: item[this.lastNameAttr],
            alias: item[this.authorAliasAttr],
            imageUrl: item[this.imageUrlAttr],
          },
          timestamp: item[this.timestampAttr],
        })
      );

      return [statuses, hasMorePages];
    } catch (error) {
      throw new Error("[Server Error] get page of followees " + error);
    }
  }
}
