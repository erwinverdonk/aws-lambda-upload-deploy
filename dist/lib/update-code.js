"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
exports.updateCode = ({ functionName, s3BucketName, s3Key }) => {
    const lambda = new AWS.Lambda();
    return lambda.updateFunctionCode({
        FunctionName: functionName,
        S3Bucket: s3BucketName,
        S3Key: s3Key
    })
        .promise()
        .then(_ => true);
};
