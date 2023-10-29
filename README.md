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

## Contributing

If you'd like to contribute to this project, please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This code is released under the [MIT License](LICENSE).

---

**Note**: Ensure that you have the required AWS permissions and have configured your S3 bucket to allow the intended actions for successful image uploads.
