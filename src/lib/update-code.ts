import * as AWS from 'aws-sdk';

type UpdateCodeParams = { functionName: string, s3BucketName: string, s3Key: string };

export const updateCode = ({
  functionName, 
  s3BucketName, 
  s3Key 
}: UpdateCodeParams) => {
  const lambda = new AWS.Lambda();
  return lambda.updateFunctionCode({
    FunctionName: functionName,
    S3Bucket: s3BucketName,
    S3Key: s3Key
  })
  .promise()
  .then(_ => true)
};