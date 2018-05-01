import * as AWS from 'aws-sdk';

export const checkLambdaExists = (
  {functionName }: { functionName: string }
) => {
  const lambda = new AWS.Lambda();
  return lambda.getFunction({
    FunctionName: functionName
  })
  .promise()
  .then(_ => true)
  .catch(_ => false);
};