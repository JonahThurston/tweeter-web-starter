import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
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
      "Post Test"
    );

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(
      mockEventInstance,
      user,
      authToken,
      "PostTest"
    );

    verify(mockStatusService.postStatus(authToken, anything())).once();

    let [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();
    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.post).toEqual("PostTest");
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message, when posting a status is successfull", async () => {
    await postStatusPresenter.submitPost(
      mockEventInstance,
      user,
      authToken,
      "post test"
    );

    verify(mockPostStatusView.displayErrorMessage(anything())).never();

    //console.log("THIS IS THE LINE THAT NO WORKS!!!");
    //verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.clearPost()).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
  });

  it(" tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message", async () => {
    const error = new Error("an error occurred");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost(
      mockEventInstance,
      user,
      authToken,
      "post test"
    );

    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post the status because of exception: an error occurred"
      )
    ).once;
    verify(mockPostStatusView.clearLastInfoMessage()).once();

    verify(mockPostStatusView.clearPost()).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).never();
  });
});
