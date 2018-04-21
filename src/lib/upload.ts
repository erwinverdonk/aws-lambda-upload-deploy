import * as AWS from 'aws-sdk';
import * as fs from 'fs';

type UploadOptions = { 
  source: string, 
  bucketName: AWS.S3.BucketName,
  path?: AWS.S3.ObjectKey
};

export const upload = ({ source, bucketName, path }: UploadOptions) => {
  const s3 = new AWS.S3();
  const file = fs.readFileSync(source);
  const fileKey = `${path || ''}${source.match(/(?<=\/)[^/]+$/)[0]}`;

  return s3.putObject({
    Bucket: bucketName,
    Key: fileKey,
    Body: file,
    ContentType: 'application/zip',
  })
  .promise()
  .then(() => {
    return {
      bucketName,
      fileKey
    }
  })
};