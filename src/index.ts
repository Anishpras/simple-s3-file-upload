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
  videoFileExtension,
}: {
  base64: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  path: string;
  videoFileExtension: string;
}) => {
  const generatedPath = `${path}${new Date().toISOString()}.${videoFileExtension}`;
  const buffer = getImageBuffer(base64);
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: generatedPath,
    Body: buffer,
    ACL: "public-read",
    ContentType: `image/${videoFileExtension}`,
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
  videoFile,
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  videoFileExtension,
}: {
  videoFile: File;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  path: string;
  videoFileExtension: string;
}) => {
  if (!videoFile) return new Error(`videoFile not found`);
  const bytes = await videoFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const generatedPath = `${path}${new Date().toISOString()}.${videoFileExtension}`;
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
export const uploadFile = async ({
  file,
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  maxFileSize,
}: {
  file: {
    buffer: Buffer;
    originalname: string;
  };
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  path: string;
  maxFileSize: number;
}) => {
  if (!file) {
    throw new Error("File not found");
  }

  if (file.buffer.length > maxFileSize * 1024 * 1024) {
    throw new Error("File size exceeds the maximum allowed size");
  }

  const fileContent = file.buffer.toString("base64");
  const bucketName = bucket;
  const s3Key = `${path}/${new Date().toISOString()}-${file.originalname}`;

  const client = s3Client({ accessKeyId, secretAccessKey, region });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: Buffer.from(fileContent, "base64"),
  });

  try {
    const response = await client.send(command);
    return { message: "File uploaded successfully", response };
  } catch (err: any) {
    console.error("Error uploading file:", err);
    throw new Error(`Error uploading file: ${err.message}`);
  }
};
