import { FollowService } from "./model/service/FollowService";
import { StatusService } from "./model/service/StatusService";

class Main {
  async Run() {
    let service: StatusService = new StatusService();
    console.log(
      await service.loadMoreFeedItems(
        "ee9d4e5f-a0ed-458c-84b2-f4a0d6a57270",
        "@allen",
        10,
        null
      )
    );
  }
}

let main: Main = new Main();
main.Run();
