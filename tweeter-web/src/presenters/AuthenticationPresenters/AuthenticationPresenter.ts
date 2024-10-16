import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "../Presenter";
import { NavigateFunction } from "react-router-dom";
import { UserService } from "../../ModelService/UserService";

export interface AuthenticationView extends View {
  updateUserInfo: (
    currentUser: User,
    displayeduser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: NavigateFunction;
}

export abstract class AuthenticationPresenter<
  T extends AuthenticationView
> extends Presenter<T> {
  protected userService: UserService;
  protected _isLoading = false;

  public constructor(view: T) {
    super(view);
    this.userService = new UserService();
  }

  public get isLoading() {
    return this._isLoading;
  }

  public checkRequiredFields(fields: (string | null)[]): boolean {
    return fields.some((field) => !field);
  }

  protected onEnterFunction(
    event: React.KeyboardEvent<HTMLElement>,
    requiredFields: (string | null)[],
    submissionFunction: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl: string | undefined
  ): void {
    if (event.key == "Enter" && !this.checkRequiredFields(requiredFields)) {
      this.doSubmit(submissionFunction, rememberMe, originalUrl);
    }
  }

  protected async doSubmit(
    submissionFunction: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl: string | undefined
  ) {
    this._isLoading = true;

    const [user, authToken] = await submissionFunction();

    this.view.updateUserInfo(user, user, authToken, rememberMe);

    if (!!originalUrl) {
      this.view.navigate(originalUrl);
    } else {
      this.view.navigate("/");
    }
  }
}
