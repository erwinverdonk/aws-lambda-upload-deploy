"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const fs = require("fs");
exports.upload = ({ source, bucketName, path }) => {
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
        };
    });
};
