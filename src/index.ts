import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { Buffer, File } from "buffer";

const getImageBuffer = (base64: string) => {
  const base64str = base64.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64str, "base64");
};
const s3Client = ({
  accessKeyId,
  secretAccessKey,
  region,
}: {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}) =>
  new S3Client({
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    region: region,
  });

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
  const generatedPath = `${path}${new Date().toISOString()}.${fileExtension}`;
  const buffer = getImageBuffer(base64);
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: generatedPath,
    Body: buffer,
    ACL: "public-read",
    ContentType: `image/${fileExtension}`,
    ContentEncoding: "base64",
  };
  const command = new PutObjectCommand(params);
  try {
    const s3 = s3Client({ accessKeyId, secretAccessKey, region });
    const data = await s3.send(command);
    return {
      url: `https://${bucket}.s3.${region}.amazonaws.com/${generatedPath}`,
      data,
    };
  } catch (error) {
    return {
      error,
    };
  }
};

export const uploadVideo = async ({
  file,
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  fileExtension,
}: {
  file: File;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  path: string;
  fileExtension: string;
}) => {
  if (!file) return new Error(`File not found`);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const generatedPath = `${path}${new Date().toISOString()}.${fileExtension}`;
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: generatedPath,
    Body: buffer,
    ACL: "public-read",
    ContentType: "video/mp4",
  };
  const command = new PutObjectCommand(params);
  try {
    const s3 = s3Client({ accessKeyId, secretAccessKey, region });
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
