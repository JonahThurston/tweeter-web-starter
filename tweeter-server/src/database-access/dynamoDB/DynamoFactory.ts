import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DaoFactory } from "../interfaces/DaoFactory";
import { FeedDao } from "../interfaces/FeedDao";
import { FollowsDao } from "../interfaces/FollowsDao";
import { S3Dao } from "../interfaces/S3Dao";
import { SessionsDao } from "../interfaces/SessionsDao";
import { StoryDao } from "../interfaces/StoryDao";
import { UsersDao } from "../interfaces/UsersDao";
import DynamoFeedDao from "./DynamoFeedDao";
import DynamoFollowsDao from "./DynamoFollowsDao";
import DynamoS3Dao from "./DynamoS3Dao";
import DynamoSessionsDao from "./DynamoSessionsDao";
import DynamoStoryDao from "./DynamoStoryDao";
import DynamoUsersDao from "./DynamoUsersDao";

export default class extends DaoFactory {
  private client: DynamoDBDocumentClient;

  public constructor() {
    super();
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  getFollowsDao(): FollowsDao {
    return new DynamoFollowsDao(this.client);
  }
  getStoryDao(): StoryDao {
    return new DynamoStoryDao(this.client);
  }
  getFeedDao(): FeedDao {
    return new DynamoFeedDao(this.client);
  }
  getSessionsDao(): SessionsDao {
    return new DynamoSessionsDao(this.client);
  }
  getUsersDao(): UsersDao {
    return new DynamoUsersDao(this.client);
  }
  getS3Dao(): S3Dao {
    return new DynamoS3Dao();
  }
}
