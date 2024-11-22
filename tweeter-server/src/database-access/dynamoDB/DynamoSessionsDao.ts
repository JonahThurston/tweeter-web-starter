import { AuthTokenDto } from "tweeter-shared";
import { SessionsDao } from "../interfaces/SessionsDao";

export default class DynamoSessionsDao extends SessionsDao {
  public async checkToken(token: string): Promise<string | null> {
    throw new Error("Method not implemented.");
  }
  public async makeNewSession(): Promise<AuthTokenDto> {
    throw new Error("Method not implemented.");
  }
  public async deleteSession(token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
