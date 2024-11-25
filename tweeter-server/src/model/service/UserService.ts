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
        throw new Error("[Bad Request] couldnt find user");
      }

      let sessionDao = this.daoFactory.getSessionsDao();
      let authToken = await sessionDao.makeNewSession(alias);
      return [retrievedUser, authToken];
    } else {
      throw new Error("[Bad Request] incorrect password or alias");
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    console.log("starting register service, checking if user already exists");
    let usersDao = this.daoFactory.getUsersDao();
    let retrievedUser = await usersDao.getUser(alias);
    if (retrievedUser != null) {
      throw new Error("[Bad Request] alias taken");
    }

    console.log("uploading picture");
    let s3Dao = this.daoFactory.getS3Dao();
    let fileName = alias + imageFileExtension;
    let imageURL = await s3Dao.uploadPicture(fileName, userImageBytes);

    console.log("creating user");
    let userDto: UserDto = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      imageUrl: imageURL,
    };
    await usersDao.createUser(userDto, password);

    console.log("authtokening");
    let sessionDao = this.daoFactory.getSessionsDao();
    let authToken = await sessionDao.makeNewSession(alias);

    console.log("done register");
    return [userDto, authToken];
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let usersDao = this.daoFactory.getUsersDao();
      return await usersDao.getUser(alias);
    }
  }
}
