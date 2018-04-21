import * as AWS from 'aws-sdk';
import * as ora from 'ora';
import * as os from 'os';
import * as fs from 'fs';
import * as deepmerge from 'deepmerge'
import chalk from 'chalk';
import { AwsCloudFormationDeploy } from 'aws-cloudformation-deploy';

import { createZip, upload, generateCloudFormationTemplate } from './lib';

export type UploadDeployOptions = {
  functionName: AWS.Lambda.FunctionName,
  sourcePath: string,
  version: string,
  s3: {
    bucketName: AWS.S3.BucketName,
    bucketPath?: AWS.S3.ObjectKey
  },
  settings?: {
    runtime?: AWS.Lambda.Runtime,
    memory?: AWS.Lambda.MemorySize,
    timeout?: AWS.Lambda.Timeout,
    servicesAllowed?: string[],
    permissions?: {
      effect: 'Allow' | 'Deny',
      action: string[],
      resource: string[]
    }[],
    exportForCloudFormation?: boolean
  }
}

const getDefaultOptions = (functionName:string) => ({
  s3: {
    bucketPath: ''
  },
  settings: {
    runtime: 'nodejs8.10',
    memory: 128,
    timeout: 3,
    servicesAllowed: [
      'lambda.amazonaws.com'
    ],
    permissions: [
      {
        effect: 'Allow',
        action: ['lambda:InvokeFunction'],
        resource: [`arn:aws:lambda:*:*:function:${functionName}`]
      }
    ],
    exportForCloudFormation: true
  }
});

const oraPromise = (message:string, promise:Promise<any>) => {
  const indicator = ora(message);

  indicator.start();

  return promise
    .then(_ => {
      indicator.succeed();
      return _;
    })
    .catch(_ => {
      indicator.fail();
      throw _;
    });
}

export const AwsLambdaUploadDeploy = ($options: UploadDeployOptions) => {
  const options:typeof $options = deepmerge(
    getDefaultOptions($options.functionName), 
    $options,
    { arrayMerge: (dest, src, opt) => src }
  );

  // Version may only contain alphabetical character, colon and hyphen.
  options.version = options.version.replace(/[^a-z0-9:-]/ig, '-');

  const start = () => {
    (oraPromise(
      'Creating Lambda package...',
      createZip({
        input: options.sourcePath,
        output: `${os.tmpdir()}/${options.functionName}-${options.version}.zip`
      })
    ) as ReturnType<typeof createZip>)
    // Upload Lambda package
    .then(async pkg => {
      await oraPromise(
        'Uploading Lambda package...', 
        upload({source: pkg.output, bucketName: options.s3.bucketName})
      )
      
      return pkg;
    })
    // Remove temporary ZIP file
    .then(pkg => fs.unlinkSync(pkg.output))
    // Deploy Lambda to AWS with CloudFormation
    .then(() => AwsCloudFormationDeploy({
        stackName: `Lambda-${options.functionName}`,
        templateBody: generateCloudFormationTemplate(options)
    }).start())
    // Pass info down 
    .then(() => ({
      functionName: options.functionName,
      bucketName: options.s3.bucketName
    }))
    // Give the 'not-ok' sign
    .catch(_ => {
      console.error(chalk.red(_));
    });
  }

  return {
    start
  }
}