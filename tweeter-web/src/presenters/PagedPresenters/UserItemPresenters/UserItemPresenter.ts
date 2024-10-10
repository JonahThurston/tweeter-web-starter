import { User } from "tweeter-shared";
import { View } from "../../Presenter";
import { PagedItemPresenter } from "../PagedItemPresenter";
import { FollowService } from "../../../ModelService/FollowService";

export interface UserItemView extends View {
  addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  FollowService
> {
  protected createService(): FollowService {
    return new FollowService();
  }
}
