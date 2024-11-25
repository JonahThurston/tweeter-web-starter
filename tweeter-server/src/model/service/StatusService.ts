import { StatusDto } from "tweeter-shared";
import { DaoFactory } from "../../database-access/interfaces/DaoFactory";

export class StatusService {
  private daoFactory: DaoFactory;

  public constructor(factory: DaoFactory) {
    this.daoFactory = factory;
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let feedDao = this.daoFactory.getFeedDao();
      return await feedDao.getPageOfItems(lastItem, userAlias, pageSize);
    }
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let storyDao = this.daoFactory.getStoryDao();
      return await storyDao.getPageOfItems(lastItem, userAlias, pageSize);
    }
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    let sessionsDao = this.daoFactory.getSessionsDao();
    if ((await sessionsDao.checkToken(token)) === null) {
      throw new Error("[Bad Request] expired token");
    } else {
      let storyDao = this.daoFactory.getStoryDao();
      let feedDao = this.daoFactory.getFeedDao();
      storyDao.postStatusToStory(newStatus);
      feedDao.postStatusToFeed(newStatus);
      return;
    }
  }
}
