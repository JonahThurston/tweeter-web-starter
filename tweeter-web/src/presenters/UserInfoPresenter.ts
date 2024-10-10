import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../ModelService/FollowService";
import { InfoMessageView, Presenter } from "./Presenter";

export interface UserInfoView extends InfoMessageView {}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;
  private _isFollower = false;
  private _followeeCount = -1;
  private _followerCount = -1;
  private _isLoading = false;

  public constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    displayedUser: User,
    authToken: AuthToken
  ): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      this.view.displayInfoMessage(`Unfollowing ${displayedUser.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken!,
        displayedUser!
      );

      this._isFollower = false;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    }, "unfollow user");
    //FINALLY
    this.view.clearLastInfoMessage();
    this._isLoading = false;
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    displayedUser: User,
    authToken: AuthToken
  ): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        displayedUser!
      );

      this._isFollower = true;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    }, "follow user");
    //Finally
    this.view.clearLastInfoMessage();
    this._isLoading = false;
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this._followerCount = await this.followService.getFollowerCount(
        authToken,
        displayedUser
      );
    }, "get followers count");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this._followeeCount = await this.followService.getFolloweeCount(
        authToken,
        displayedUser
      );
    }, "get followees count");
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this._isFollower = false;
      } else {
        this._isFollower = await this.followService.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
      }
    }, "determine follower status");
  }

  public get isLoading() {
    return this._isLoading;
  }

  public get isFollower() {
    return this._isFollower;
  }

  public get followerCount() {
    return this._followerCount;
  }

  public get followeeCount() {
    return this._followeeCount;
  }
}
