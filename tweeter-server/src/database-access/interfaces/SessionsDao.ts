import { AuthTokenDto } from "tweeter-shared";

export abstract class SessionsDao {
  abstract checkToken(token: string): Promise<string | null>;
  abstract makeNewSession(): Promise<AuthTokenDto>;
  abstract deleteSession(token: string): Promise<void>;
}
