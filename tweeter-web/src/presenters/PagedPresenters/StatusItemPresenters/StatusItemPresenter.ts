import { Status } from "tweeter-shared";
import { View } from "../../Presenter";
import { PagedItemPresenter } from "../PagedItemPresenter";
import { StatusService } from "../../../ModelService/StatusService";

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusService
> {
  protected createService(): StatusService {
    return new StatusService();
  }
}
