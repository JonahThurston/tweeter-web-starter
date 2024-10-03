import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../ModelService/StatusService";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  clearPost: (event?: React.MouseEvent) => void;
}

export class PostStatusPresenter {
  private statusService: StatusService;
  private _view: PostStatusView;
  private _isLoading = false;

  public constructor(view: PostStatusView) {
    this._view = view;
    this.statusService = new StatusService();
  }

  public async submitPost(
    event: React.MouseEvent,
    currentUser: User,
    authToken: AuthToken,
    post: string
  ) {
    event.preventDefault();

    try {
      this._isLoading = true;
      this._view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser, Date.now());

      await this.statusService.postStatus(authToken, status);

      this._view.clearPost();
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._isLoading = false;
    }
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
