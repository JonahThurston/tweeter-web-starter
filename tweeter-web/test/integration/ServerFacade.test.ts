import {
  AuthToken,
  FollowCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe("server facade", () => {
  let serverFacade: ServerFacade = new ServerFacade();

  it("Has a register function which returns a User and an AuthToken", async () => {
    let request: RegisterRequest = {
      firstName: "firstName",
      lastName: "lastName",
      alias: "@alias",
      password: "password",
      imageString: "imageString",
      imageExtension: "imageExtension",
    };

    let [foundUser, foundToken] = await serverFacade.register(request);

    expect(foundUser).toBeInstanceOf(User);
    expect(foundToken).toBeInstanceOf(AuthToken);
  });

  it("Has a getMoreFollowers function which returns an array of users and a boolean", async () => {
    let request: PagedUserItemRequest = {
      token: "ee9d4e5f-a0ed-458c-84b2-f4a0d6a57270",
      userAlias: "@allen",
      pageSize: 10,
      lastItem: {
        firstName: "Frank",
        lastName: "Frandson",
        alias: "@frank",
        imageUrl:
          "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png",
      },
    };

    let [items, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(Array.isArray(items)).toBe(true);
    expect(items.every((item) => item instanceof User)).toBe(true);

    expect(typeof hasMore).toBe("boolean");
  });

  it("has a GetFollowersCount function which returns a number", async () => {
    let request: FollowCountRequest = {
      token: "ee9d4e5f-a0ed-458c-84b2-f4a0d6a57270",
      user: {
        firstName: "Frank",
        lastName: "Frandson",
        alias: "@frank",
        imageUrl:
          "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png",
      },
    };

    let followerCount = await serverFacade.getFollowerCount(request);

    expect(typeof followerCount).toBe("number");
  });
});
