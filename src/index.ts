import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
  imageFileExtension,
}: {
  base64: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  path: string;
  imageFileExtension: string;
}) => {
  const generatedPath = `${path}${new Date().toISOString()}.${imageFileExtension}`;
  const buffer = getImageBuffer(base64);
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: generatedPath,
    Body: buffer,
    ACL: "public-read",
    ContentType: `image/${imageFileExtension}`,
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
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error uploading image: ${error.message}`);
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
    return {
      url: `https://${bucket}.s3.${region}.amazonaws.com/${generatedPath}`,
      data,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error uploading video: ${error.message}`);
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
    return {
      message: "File uploaded successfully",
      response,
      url: `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`,
    };
  } catch (err: any) {
    console.error("Error uploading file:", err);
    throw new Error(`Error uploading file: ${err.message}`);
  }
};

export const uploadFileUsingPresignedUrl = async ({
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  targetFile,
}: {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  path: string;
  targetFile: HTMLFormElement;
}) => {
  try {
    const formData = new FormData(targetFile);

    const file = formData.get("file");

    if (!file) {
      throw new Error("File not found");
    }
    if (!(file instanceof File)) {
      throw new Error("File not found or invalid type");
    }
    const fileType = encodeURIComponent(file.type);
    const generatedPath = `${path}${new Date().toISOString()}.${fileType}`;
    const client = s3Client({ accessKeyId, secretAccessKey, region });
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: generatedPath,
    });
    const preSignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });
    const response = await fetch(preSignedUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return {
      message: "File uploaded successfully",
      response,
      url: `https://${bucket}.s3.${region}.amazonaws.com/${generatedPath}`,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

export const getUploadPresignedUrl = async ({
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  fileType,
}: {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  path: string;
  fileType: string;
}) => {
  try {
    // const formData = new FormData(targetFile);

    // const file = formData.get("file");

    // if (!file) {
    //   throw new Error("File not found");
    // }
    // if (!(file instanceof File)) {
    //   throw new Error("File not found or invalid type");
    // }
    // const fileType = encodeURIComponent(file.type);
    const generatedPath = `${path}${new Date().toISOString()}.${fileType}`;
    const client = s3Client({ accessKeyId, secretAccessKey, region });
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: generatedPath,
    });
    const preSignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });
    // const response = await fetch(preSignedUrl, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: file,
    // });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    return preSignedUrl;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error uploading file: ${error.message}`);
  }
};
