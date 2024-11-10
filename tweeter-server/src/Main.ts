import { FollowService } from "./model/service/FollowService";

class Main {
  async Run() {
    let service: FollowService = new FollowService();
    console.log(
      await service.loadMoreFollowees(
        "ee9d4e5f-a0ed-458c-84b2-f4a0d6a57270",
        "@allen",
        10,
        {
          firstName: "Frank",
          lastName: "Frandson",
          alias: "@frank",
          imageUrl:
            "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png",
        }
      )
    );
  }
}

let main: Main = new Main();
main.Run();
