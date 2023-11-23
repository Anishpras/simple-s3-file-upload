# Simple S3 Image Upload

Simple S3 Image Upload is a Node.js package that simplifies the process of uploading images to Amazon S3 (Simple Storage Service). It uses the AWS SDK for JavaScript (`@aws-sdk/client-s3`) and the `Buffer` module to handle image data. This package allows you to quickly and easily upload images to your S3 bucket.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Example](#example)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install the Simple S3 Image Upload package using npm:

```bash
npm install simple-s3-file-upload
```

## Usage

To use this package, follow these steps:

1. Import the `uploadImage` function from the package.
2. Provide the required parameters to the `uploadImage` function.
3. Handle the promise returned by the function to access the uploaded image's URL.

### Configuration

Before using the package, you need to configure your AWS credentials and region. You can do this by setting environment variables or using other AWS SDK configuration methods.

Ensure you have the following environment variables set:

- `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
- `AWS_REGION`: The AWS region where your S3 bucket is located.

Alternatively, you can configure the AWS SDK using the `aws-sdk` library or by specifying credentials and region directly in your code.

### Example

Here's an example of how to use the Simple S3 Image Upload package:

```javascript
const { uploadImage } = require("simple-s3-file-upload");

const base64Image =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw..."; // Replace with your base64 image data
const accessKeyId = "your-access-key-id";
const secretAccessKey = "your-secret-access-key";
const region = "your-s3-region";
const bucket = "your-s3-bucket";
const path = "your-image-path";
const fileExtension = "jpg";

uploadImage({
  base64: base64Image,
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  fileExtension,
})
  .then((result) => {
    console.log(`Image uploaded successfully. URL: ${result.url}`);
  })
  .catch((error) => {
    console.error(`Error uploading image: ${error}`);
  });
```

Replace the placeholders with your actual image data and AWS credentials. The `uploadImage` function uploads the image to your specified S3 bucket and returns the URL of the uploaded image.

## API Documentation

The `uploadImage` function accepts the following parameters in its configuration object:

- `base64` (string): The base64-encoded image data.
- `accessKeyId` (string): Your AWS access key ID.
- `secretAccessKey` (string): Your AWS secret access key.
- `region` (string): The AWS region where your S3 bucket is located.
- `bucket` (string): The name of your S3 bucket.
- `path` (string): The path to save the image within the bucket.
- `fileExtension` (string): The file extension of the image (e.g., "jpg", "png").

## Documentation for `uploadVideo` Function

The `uploadVideo` function is designed to facilitate the upload of video files to an Amazon S3 bucket. This function is asynchronous and takes an object as an argument with the following properties:

- `file` (required): The video file to be uploaded. It should be of type `File`.
- `accessKeyId` (required): The access key ID for AWS S3 authentication.
- `secretAccessKey` (required): The secret access key for AWS S3 authentication.
- `region` (required): The AWS region where the S3 bucket is located.
- `bucket` (required): The name of the S3 bucket where the file will be uploaded.
- `path` (required): The path within the S3 bucket where the file will be stored.
- `fileExtension` (required): The file extension of the video file.

## Example Usage

```javascript
import { uploadVideo } from 'simple-s3-file-upload';

const file = /* provide the File object representing your video */;
const accessKeyId = 'your-access-key-id';
const secretAccessKey = 'your-secret-access-key';
const region = 'your-aws-region';
const bucket = 'your-s3-bucket';
const path = 'your-s3-path';
const fileExtension = 'mp4';

uploadVideo({
  file,
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  fileExtension,
})
  .then((result) => {
    console.log('Upload successful:', result);
  })
  .catch((error) => {
    console.error('Error during upload:', error);
  });
```

## Function Details

### Input Parameters

- `file` (type: `File`, required): The video file to be uploaded.
- `accessKeyId` (type: `string`, required): AWS access key ID for S3 authentication.
- `secretAccessKey` (type: `string`, required): AWS secret access key for S3 authentication.
- `region` (type: `string`, required): AWS region where the S3 bucket is located.
- `bucket` (type: `string`, required): Name of the S3 bucket where the file will be uploaded.
- `path` (type: `string`, required): Path within the S3 bucket where the file will be stored.
- `fileExtension` (type: `string`, required): File extension of the video file.

### Output

The function returns a Promise that resolves to an object with the following properties:

- `url` (type: `string`): The public URL of the uploaded video file.
- `data` (type: `PutObjectCommandOutput`): The response data from the AWS S3 service.

## Error Handling

If the `file` parameter is not provided, the function returns an `Error` object with the message "File not found."

If an error occurs during the S3 upload process, the function catches the error and logs it to the console.

# `uploadFile` Function Documentation

The `uploadFile` function is designed to facilitate the upload of files to an Amazon S3 bucket. This function is asynchronous and takes an object as an argument with the following properties:

## Input Parameters

- `file` (type: `Object`, required): An object containing the file details, including the file buffer and original name.

  - `buffer` (type: `Buffer`, required): The file content as a Buffer.
  - `originalname` (type: `string`, required): The original name of the file.

- `accessKeyId` (type: `string`, required): AWS access key ID for S3 authentication.
- `secretAccessKey` (type: `string`, required): AWS secret access key for S3 authentication.
- `region` (type: `string`, required): AWS region where the S3 bucket is located.
- `bucket` (type: `string`, required): Name of the S3 bucket where the file will be uploaded.
- `path` (type: `string`, required): Path within the S3 bucket where the file will be stored.
- `maxFileSize` (type: `number`, required): Maximum allowed file size in megabytes.

## Output

The function returns a Promise that resolves to an object with the following properties:

- `message` (type: `string`): A success message indicating that the file was uploaded successfully.
- `response` (type: `PutObjectCommandOutput`): The response data from the AWS S3 service.

## Error Handling

If the `file` parameter is not provided, the function throws an `Error` with the message "File not found."

If the file size exceeds the specified `maxFileSize`, the function throws an `Error` with the message "File size exceeds the maximum allowed size."

If an error occurs during the S3 upload process, the function catches the error, logs it to the console, and throws an `Error` with a detailed error message.

## Dependencies

This function relies on an external `s3Client` function, assumed to be correctly implemented elsewhere in your codebase.

Please make sure to handle the AWS SDK and any other dependencies appropriately in your project.

## Example Usage

````javascript
import { uploadFile } from 'simple-s3-file-upload';

const file = /* provide the object containing file buffer and original name */;
const accessKeyId = 'your-access-key-id';
const secretAccessKey = 'your-secret-access-key';
const region = 'your-aws-region';
const bucket = 'your-s3-bucket';
const path = 'your-s3-path';
const maxFileSize = 5; // Maximum file size allowed in megabytes

uploadFile({
  file,
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  maxFileSize,
})
  .then((result) => {
    console.log('File uploaded successfully:', result.message);
  })
  .catch((error) => {
    console.error('Error during file upload:', error.message);
  });

# `uploadFileUsingPresignedUrl` Function Documentation

The `uploadFileUsingPresignedUrl` function is designed to facilitate the upload of files to an Amazon S3 bucket using a presigned URL. This function is asynchronous and takes an object as an argument with the following properties:

## Input Parameters

- `accessKeyId` (type: `string`, required): AWS access key ID for S3 authentication.
- `secretAccessKey` (type: `string`, required): AWS secret access key for S3 authentication.
- `region` (type: `string`, required): AWS region where the S3 bucket is located.
- `bucket` (type: `string`, required): Name of the S3 bucket where the file will be uploaded.
- `path` (type: `string`, required): Path within the S3 bucket where the file will be stored.
- `targetFile` (type: `HTMLFormElement`, required): The HTML form element containing the file to be uploaded.

## Output

The function returns a Promise that resolves to an object with the following properties:

- `message` (type: `string`): A success message indicating that the file was uploaded successfully.
- `response` (type: `Response`): The response object from the fetch operation.
- `url` (type: `string`): The public URL of the uploaded file.

## Error Handling

If the `targetFile` parameter is not provided or does not contain a valid file, the function throws an `Error` with the message "File not found or invalid type."

If an error occurs during the S3 upload process or the fetch operation, the function catches the error, logs it to the console, and throws an `Error` with a detailed error message.

## Dependencies

This function relies on an external `s3Client` function, assumed to be correctly implemented elsewhere in your codebase. Additionally, it uses the `getSignedUrl` function to generate a presigned URL for S3 uploads.

Please make sure to handle the AWS SDK and any other dependencies appropriately in your project.

## Example Usage

```javascript
import { uploadFileUsingPresignedUrl } from 'simple-s3-file-upload';

const accessKeyId = 'your-access-key-id';
const secretAccessKey = 'your-secret-access-key';
const region = 'your-aws-region';
const bucket = 'your-s3-bucket';
const path = 'your-s3-path';
const targetFile = /* provide the HTML form element containing the file */;

uploadFileUsingPresignedUrl({
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  path,
  targetFile,
})
  .then((result) => {
    console.log('File uploaded successfully:', result.message);
    console.log('Public URL:', result.url);
  })
  .catch((error) => {
    console.error('Error during file upload:', error.message);
  });

## Dependencies

This function relies on an external `s3Client` function, assumed to be correctly implemented elsewhere in your codebase.

Please make sure to handle the AWS SDK and any other dependencies appropriately in your project.

## Contributing

If you'd like to contribute to this project, please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This code is released under the [MIT License](LICENSE).

---

**Note**: Ensure that you have the required AWS permissions and have configured your S3 bucket to allow the intended actions for successful image uploads.
````
