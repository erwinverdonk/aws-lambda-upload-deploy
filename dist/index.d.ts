import * as AWS from 'aws-sdk';
export declare type UploadDeployOptions = {
    functionName: AWS.Lambda.FunctionName;
    handlerName: string;
    sourcePath: string;
    version: string;
    s3: {
        bucketName: AWS.S3.BucketName;
        bucketPath?: string;
        key?: AWS.S3.ObjectKey;
    };
    settings?: {
        runtime?: AWS.Lambda.Runtime;
        memory?: AWS.Lambda.MemorySize;
        timeout?: AWS.Lambda.Timeout;
        environment?: AWS.Lambda.EnvironmentVariables;
        servicesAllowed?: string[];
        managedPolicies?: string[];
        permissions?: {
            effect: 'Allow' | 'Deny';
            action: string[];
            resource: string[];
        }[];
        vpcConfig?: {
            subnetIds?: AWS.Lambda.SubnetIds;
            securityGroupIds?: AWS.Lambda.SecurityGroupIds;
        };
        exportForCloudFormation?: boolean;
    };
};
export declare const AwsLambdaUploadDeploy: ($options: UploadDeployOptions) => {
    start: () => Promise<void | {
        functionName: string;
        bucketName: string;
        cloudformation: {
            outputs: AWS.CloudFormation.Output[];
        };
    }>;
};
