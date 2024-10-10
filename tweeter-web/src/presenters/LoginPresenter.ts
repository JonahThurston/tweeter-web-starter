import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../ModelService/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  updateUserInfo: (
    currentUser: User,
    displayeduser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: NavigateFunction;
}

export class LoginPresenter extends Presenter<LoginView> {
  private _isLoading = false;
  private userService: UserService;
  private originalUrl: string | undefined;

  public constructor(view: LoginView, originalUrl: string | undefined) {
    super(view);
    this.userService = new UserService();
    this.originalUrl = originalUrl;
  }

  public checkSubmitButtonStatus(
    alias: string | null,
    password: string | null
  ): boolean {
    return !alias || !password;
  }

  public loginOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    alias: string | null,
    password: string | null,
    rememberMe: boolean
  ) {
    if (
      event.key == "Enter" &&
      !this.checkSubmitButtonStatus(alias, password)
    ) {
      this.doLogin(alias!, password!, rememberMe);
    }
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    this.doFailureReportingOperation(async () => {
      this._isLoading = true;

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!this.originalUrl) {
        this.view.navigate(this.originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, "log user in");
    //THIS LINE USED TO BE IN A FINALLY BLOCK IS THAT CHILL????
    this._isLoading = false;
  }

  public get isLoading() {
    return this._isLoading;
  }
}
