import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../ModelService/UserService";
import { NavigateFunction } from "react-router-dom";

export interface LoginView {
  updateUserInfo: (
    currentUser: User,
    displayeduser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorMessage: (message: string) => void;
  navigate: NavigateFunction;
}

export class LoginPresenter {
  private _isLoading = false;
  private userService: UserService;
  private view: LoginView;
  private originalUrl: string | undefined;

  public constructor(view: LoginView, originalUrl: string | undefined) {
    this.view = view;
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
    try {
      this._isLoading = true;

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!this.originalUrl) {
        this.view.navigate(this.originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this._isLoading = false;
    }
  }

  public get isLoading() {
    return this._isLoading;
  }
}
