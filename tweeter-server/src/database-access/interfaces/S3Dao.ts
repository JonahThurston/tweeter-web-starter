export abstract class S3Dao {
  abstract uploadPicture(
    fileName: string,
    imageStringBase64: string
  ): Promise<string>;
}
