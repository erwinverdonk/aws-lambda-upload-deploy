"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
exports.generateCloudFormationTemplate = (options) => {
    const template = fs
        .readFileSync(`${__dirname}/../../src/lambda.template.yaml`, 'utf8')
        .replace(/@{S3Bucket}/g, options.s3.bucketName)
        .replace(/@{S3Key}/g, `${options.s3.bucketPath}${options.functionName}-${options.version}.zip`)
        .replace(/@{FunctionName}/g, options.functionName)
        .replace(/@{Runtime}/g, options.settings.runtime)
        .replace(/@{Timeout}/g, options.settings.timeout.toString())
        .replace(/@{Version}/g, options.version)
        .replace(/@{RoleStatement}/g, JSON.stringify([{
            Effect: 'Allow',
            Principal: {
                Service: options.settings.servicesAllowed
            },
            Action: ['sts:AssumeRole']
        }]))
        .replace(/@{PolicyStatement}/g, JSON.stringify(options.settings.permissions.map((_) => Object.keys(_)
        .reduce((acc, key) => {
        acc[key.replace(/^\w/, _ => _.toUpperCase())] = _[key];
        return acc;
    }, {}))));
    return template;
};
