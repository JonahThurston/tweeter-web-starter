import { Buffer } from "buffer";
import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DaoFactory } from "../../database-access/interfaces/DaoFactory";

export class UserService {
  private daoFactory: DaoFactory;

  public constructor(factory: DaoFactory) {
    this.daoFactory = factory;
  }

  public async logout(token: string): Promise<void> {
    let sessionDao = this.daoFactory.getSessionsDao();
    return await sessionDao.deleteSession(token);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    let usersDao = this.daoFactory.getUsersDao();
    let correctPassword = await usersDao.checkUserPassword(alias, password);
    if (correctPassword) {
      let retrievedUser = await usersDao.getUser(alias);
      if (retrievedUser === null) {
        throw new Error("Bad Request");
      }

      let sessionDao = this.daoFactory.getSessionsDao();
      let authToken = await sessionDao.makeNewSession();
      return [retrievedUser, authToken];
    } else {
      throw new Error("Bad Request");
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    let usersDao = this.daoFactory.getUsersDao();
    let retrievedUser = await usersDao.getUser(alias);
    if (retrievedUser != null) {
      throw new Error("Bad Request");
    }

    let s3Dao = this.daoFactory.getS3Dao();
    let fileName = alias + imageFileExtension;
    let imageURL = await s3Dao.uploadPicture(fileName, imageStringBase64);

    let userDto: UserDto = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      imageUrl: imageURL,
    };

    await usersDao.createUser(userDto, password);
    let sessionDao = this.daoFactory.getSessionsDao();
    let authToken = await sessionDao.makeNewSession();
    return [userDto, authToken];
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("Bad Request");
    } else {
      let usersDao = this.daoFactory.getUsersDao();
      return await usersDao.getUser(alias);
    }
  }
}
