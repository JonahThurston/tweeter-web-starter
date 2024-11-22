import { FeedDao } from "./FeedDao";
import { FollowsDao } from "./FollowsDao";
import { S3Dao } from "./S3Dao";
import { SessionsDao } from "./SessionsDao";
import { StoryDao } from "./StoryDao";
import { UsersDao } from "./UsersDao";

export abstract class DaoFactory {
  abstract getFollowsDao(): FollowsDao;
  abstract getStoryDao(): StoryDao;
  abstract getFeedDao(): FeedDao;
  abstract getSessionsDao(): SessionsDao;
  abstract getUsersDao(): UsersDao;
  abstract getS3Dao(): S3Dao;
}
