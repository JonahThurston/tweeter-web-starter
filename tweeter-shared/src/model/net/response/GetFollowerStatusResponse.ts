import { TweeterResponse } from "./TweeterResponse";

export interface GetFollowerStatusResponse extends TweeterResponse {
  readonly status: boolean;
}
