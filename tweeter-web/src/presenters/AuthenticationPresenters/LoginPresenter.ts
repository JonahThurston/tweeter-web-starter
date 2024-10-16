import { UserService } from "../../ModelService/UserService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  private originalUrl: string | undefined;

  public constructor(
    view: AuthenticationView,
    originalUrl: string | undefined
  ) {
    super(view);
    this.originalUrl = originalUrl;
  }

  public loginOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    alias: string | null,
    password: string | null,
    rememberMe: boolean
  ) {
    const requiredFields = [alias, password];
    this.onEnterFunction(
      event,
      requiredFields,
      this.getSubmissionFunction(alias!, password!),
      rememberMe,
      this.originalUrl
    );
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    this.doFailureReportingOperation(async () => {
      this.doSubmit(
        this.getSubmissionFunction(alias, password),
        rememberMe,
        this.originalUrl
      );
    }, "log user in");
    //THIS LINE USED TO BE IN A FINALLY BLOCK IS THAT CHILL????
    this._isLoading = false;
  }

  private getSubmissionFunction(alias: string, password: string) {
    return async () => {
      return this.userService.login(alias, password);
    };
  }
}
