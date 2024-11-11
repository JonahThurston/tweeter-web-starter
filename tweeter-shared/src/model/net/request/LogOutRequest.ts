import { TweeterRequest } from "./TweeterRequest";

export interface LogOutRequest extends TweeterRequest {
  readonly token: string;
}
