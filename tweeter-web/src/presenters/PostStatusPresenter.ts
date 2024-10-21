import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../ModelService/StatusService";
import { InfoMessageView, Presenter } from "./Presenter";

export interface PostStatusView extends InfoMessageView {
  clearPost: (event?: React.MouseEvent) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;
  private _isLoading = false;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService() {
    return this._statusService;
  }

  public async submitPost(
    event: React.MouseEvent,
    currentUser: User,
    authToken: AuthToken,
    post: string
  ) {
    event.preventDefault();

    this.doFailureReportingWithFinally(
      async () => {
        this._isLoading = true;
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser, Date.now());

        await this.statusService.postStatus(authToken, status);

        this.view.clearPost();
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.clearLastInfoMessage();
        this._isLoading = false;
      }
    );
  }

  public checkButtonStatus(
    authToken: AuthToken | null,
    currentUser: User | null,
    post: string
  ) {
    return !post.trim() || !authToken || !currentUser;
  }

  public get isLoading() {
    return this._isLoading;
  }
}
