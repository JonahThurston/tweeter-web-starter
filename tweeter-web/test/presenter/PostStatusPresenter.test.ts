import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../../src/ModelService/StatusService";

describe("PostStatusPresenter", () => {
  let postStatusPresenter: PostStatusPresenter;
  let mockEvent: React.MouseEvent;
  let mockEventInstance: React.MouseEvent;
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;

  const user = new User("firstName", "lastName", "alias", "imageUrl");
  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockEvent = mock<React.MouseEvent>();
    mockEventInstance = instance(mockEvent);

    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance
    );
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(
      mockEventInstance,
      user,
      authToken,
      anything()
    );

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {});

  it("tells the view to clear the last info message, clear the post, and display a status posted message, when posting a status is successfull", async () => {});

  it(" tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message", async () => {});
});
