import { S3Dao } from "../interfaces/S3Dao";

export default class DynamoS3Dao extends S3Dao {
  public async uploadPicture(
    fileName: string,
    imageStringBase64: string
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
