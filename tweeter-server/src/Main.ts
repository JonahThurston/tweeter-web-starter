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
    //let client = DynamoDBDocumentClient.from(new DynamoDBClient());
    let service = new StatusService(new DynamoFactory());
    console.log(
      await service.postStatus("13a07e0b-616b-4124-9511-3be1e4d32f2d", {
        post: "post3",
        user: {
          firstName: "m",
          lastName: "m",
          alias: "m",
          imageUrl: "image",
        },
        timestamp: 100,
      })
    );
  }
}

let main: Main = new Main();
main.Run();
