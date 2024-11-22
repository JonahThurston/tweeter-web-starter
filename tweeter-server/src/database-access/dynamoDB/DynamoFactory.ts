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
  getFollowsDao(): FollowsDao {
    return new DynamoFollowsDao();
  }
  getStoryDao(): StoryDao {
    return new DynamoStoryDao();
  }
  getFeedDao(): FeedDao {
    return new DynamoFeedDao();
  }
  getSessionsDao(): SessionsDao {
    return new DynamoSessionsDao();
  }
  getUsersDao(): UsersDao {
    return new DynamoUsersDao();
  }
  getS3Dao(): S3Dao {
    return new DynamoS3Dao();
  }
}
