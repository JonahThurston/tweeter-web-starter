import { S3Dao } from "../interfaces/S3Dao";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

export default class DynamoS3Dao extends S3Dao {
  public async uploadPicture(
    fileName: string,
    imageStringBase64: string
  ): Promise<string> {
    let BUCKET = "tweeter-user-profile-pics";
    let REGION = "us-west-1";

    let decodedImageBuffer: Buffer = Buffer.from(imageStringBase64, "base64");
    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("[Server Error] s3 put image failed with: " + error);
    }
  }
}
