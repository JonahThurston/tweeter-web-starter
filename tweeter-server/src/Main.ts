import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import DynamoFactory from "./database-access/dynamoDB/DynamoFactory";
import DynamoSessionsDao from "./database-access/dynamoDB/DynamoSessionsDao";
import DynamoStoryDao from "./database-access/dynamoDB/DynamoStoryDao";
import DynamoUsersDao from "./database-access/dynamoDB/DynamoUsersDao";
import { SessionsDao } from "./database-access/interfaces/SessionsDao";
import { FollowService } from "./model/service/FollowService";
import { StatusService } from "./model/service/StatusService";
import { UserService } from "./model/service/UserService";
import { handler } from "./lambda/user/RegisterLambda";
import DynamoFollowsDao from "./database-access/dynamoDB/DynamoFollowsDao";
import DynamoFeedDao from "./database-access/dynamoDB/DynamoFeedDao";

class Main {
  async Run() {
    let client = DynamoDBDocumentClient.from(new DynamoDBClient());
    let service = new DynamoFeedDao(client);
    console.log(
      await service.getPageOfItems(
        {
          post: "post 1",
          timestamp: 1732580013706,
          user: {
            alias: "@marcus",
            firstName: "marcus",
            lastName: "thurston",
            imageUrl:
              "https://tweeter-user-profile-pics.s3.us-west-1.amazonaws.com/image/@marcuspng",
          },
        },
        "@jonah",
        10
      )
    );
  }
}

let main: Main = new Main();
main.Run();
