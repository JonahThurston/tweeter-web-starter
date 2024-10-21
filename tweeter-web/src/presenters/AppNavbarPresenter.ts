import { AuthToken } from "tweeter-shared";
import { UserService } from "../ModelService/UserService";
import { InfoMessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends InfoMessageView {
  clearUserInfo: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private _userService: UserService;

  public constructor(view: AppNavbarView) {
    super(view);
    this._userService = new UserService();
  }

  public get userService() {
    return this._userService;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
