import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { Buffer } from "buffer";

const getImageBuffer = (base64: string) => {
  const base64str = base64.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64str, "base64");
};
export const uploadImage = async ({
  base64,
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  fileExtension,
}: {
  base64: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  path: string;
  fileExtension: string;
}) => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    region: region,
  });
  const generatedPath = `${new Date().toISOString()}+${path}+${fileExtension}`;
  const buffer = getImageBuffer(base64);
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: generatedPath,
    Body: buffer,
    ACL: "public-read",
    ContentType: "image/jpeg",
    ContentEncoding: "base64",
  };
  const command = new PutObjectCommand(params);
  try {
    const data = await s3.send(command);
    console.log(data);
    return {
      url: `https://${bucket}.s3.${region}.amazonaws.com/${generatedPath}`,
      data,
    };
  } catch (error) {
    console.log(error);
  }
};
