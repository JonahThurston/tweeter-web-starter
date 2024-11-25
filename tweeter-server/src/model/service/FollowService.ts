import { UserDto } from "tweeter-shared";
import { DaoFactory } from "../../database-access/interfaces/DaoFactory";

export class FollowService {
  private daoFactory: DaoFactory;

  public constructor(factory: DaoFactory) {
    this.daoFactory = factory;
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let followsDao = this.daoFactory.getFollowsDao();
      return await followsDao.getPageOfFollowers(lastItem, userAlias, pageSize);
    }
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let followsDao = this.daoFactory.getFollowsDao();
      return await followsDao.getPageOfFollowees(lastItem, userAlias, pageSize);
    }
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    let returnedAlias = await sessionsDao.checkToken(token);
    if (returnedAlias === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let followsDao = this.daoFactory.getFollowsDao();
      await followsDao.deleteFollowItem(returnedAlias, userToUnfollow);

      const followerCount = await this.getFollowerCount(token, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

      return [followerCount, followeeCount];
    }
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let followsDao = this.daoFactory.getFollowsDao();
      return await followsDao.followerCount(user);
    }
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let followsDao = this.daoFactory.getFollowsDao();
      return await followsDao.followeeCount(user);
    }
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    let returnedAlias = await sessionsDao.checkToken(token);
    if (returnedAlias === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let followsDao = this.daoFactory.getFollowsDao();
      await followsDao.makeFollowItem(returnedAlias, userToFollow);

      const followerCount = await this.getFollowerCount(token, userToFollow);
      const followeeCount = await this.getFolloweeCount(token, userToFollow);

      return [followerCount, followeeCount];
    }
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let followsDao = this.daoFactory.getFollowsDao();
      return await followsDao.getIsFollowerStatus(user, selectedUser);
    }
  }
}
