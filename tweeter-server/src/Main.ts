import DynamoFactory from "./database-access/dynamoDB/DynamoFactory";
import DynamoSessionsDao from "./database-access/dynamoDB/DynamoSessionsDao";
import DynamoStoryDao from "./database-access/dynamoDB/DynamoStoryDao";
import DynamoUsersDao from "./database-access/dynamoDB/DynamoUsersDao";
import { SessionsDao } from "./database-access/interfaces/SessionsDao";
import { FollowService } from "./model/service/FollowService";
import { StatusService } from "./model/service/StatusService";
import { UserService } from "./model/service/UserService";

class Main {
  async Run() {
    let storyDao = new DynamoStoryDao();
    console.log(await storyDao.getPageOfItems(null, "b", 10));
  }
}

let main: Main = new Main();
main.Run();
