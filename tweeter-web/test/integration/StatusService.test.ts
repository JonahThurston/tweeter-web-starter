import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../src/ModelService/StatusService";
import "isomorphic-fetch";

describe("Status service", () => {
  let statusService = new StatusService();
  it("has a loadMoreStoryItems function that gets a page of story items", async () => {
    let authToken = new AuthToken("bleh", 10);

    let [items, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      "@alias",
      10,
      null
    );

    expect(Array.isArray(items)).toBe(true);
    expect(items.every((item) => item instanceof Status)).toBe(true);

    expect(typeof hasMore).toBe("boolean");
  });
});
