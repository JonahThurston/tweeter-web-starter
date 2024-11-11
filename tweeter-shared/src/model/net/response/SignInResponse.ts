import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface SignInResponse extends TweeterResponse {
  readonly user: UserDto;
  readonly token: AuthTokenDto;
}
