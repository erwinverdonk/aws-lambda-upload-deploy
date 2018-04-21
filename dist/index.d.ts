import * as AWS from 'aws-sdk';
export declare type DeployOptions = {
    functionName: AWS.Lambda.FunctionName;
    sourcePath: string;
    version: string;
    s3: {
        bucketName: AWS.S3.BucketName;
        bucketPath?: AWS.S3.ObjectKey;
    };
    settings?: {
        runtime?: AWS.Lambda.Runtime;
        memory?: AWS.Lambda.MemorySize;
        timeout?: AWS.Lambda.Timeout;
        servicesAllowed?: string[];
        permissions?: {
            effect: 'Allow' | 'Deny';
            action: string[];
            resource: string[];
        }[];
        exportForCloudFormation?: boolean;
    };
};
export declare const AwsLambdaDeploy: ($options: DeployOptions) => {
    start: () => void;
};
