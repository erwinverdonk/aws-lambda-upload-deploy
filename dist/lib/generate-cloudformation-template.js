"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
exports.generateCloudFormationTemplate = (options, lambdaExists) => {
    const template = fs.readFileSync(`${__dirname}/../../src/lambda${lambdaExists ? '.version' : ''}.template.yaml`, 'utf8');
    return template
        .replace(/@{S3Bucket}/g, options.s3.bucketName)
        .replace(/@{S3Key}/g, options.s3.key)
        .replace(/@{FunctionName}/g, options.functionName)
        .replace(/@{HandlerName}/g, options.handlerName)
        .replace(/@{Runtime}/g, options.settings.runtime)
        .replace(/@{ReservedConcurrentExecutions}/g, (!Number.isNaN(Number.parseInt(options.settings.reservedConcurrentExecutions.toString()))
        ? options.settings.reservedConcurrentExecutions
        : '!Ref AWS::NoValue').toString())
        .replace(/@{Timeout}/g, options.settings.timeout.toString())
        .replace(/@{VpcConfig}/g, options.settings.vpcConfig
        ? JSON.stringify(Object.keys(options.settings.vpcConfig)
            .reduce((acc, key) => {
            acc[key.replace(/^\w/, _ => _.toUpperCase())] = (options.settings.vpcConfig[key]);
            return acc;
        }, {}))
        : '!Ref AWS::NoValue')
        .replace(/@{Environment}/g, JSON.stringify(options.settings.environment))
        .replace(/@{Version}/g, options.version)
        .replace(/@{TracingMode}/g, options.settings.tracingConfig.mode)
        .replace(/@{RoleStatement}/g, JSON.stringify([{
            Effect: 'Allow',
            Principal: {
                Service: options.settings.servicesAllowed
            },
            Action: ['sts:AssumeRole']
        }]))
        .replace(/@{ManagedPolicies}/g, options.settings.managedPolicies
        ? `ManagedPolicyArns: ${JSON.stringify(options.settings.managedPolicies)}`
        : '')
        .replace(/@{PolicyStatement}/g, JSON.stringify(options.settings.permissions.concat([{
            effect: 'Allow',
            action: [
                'lambda:InvokeFunction'
            ],
            resource: [
                `arn:aws:lambda:*:*:function:${options.functionName}`,
                `arn:aws:lambda:*:*:function:${options.functionName}:*`
            ]
        }, {
            effect: 'Allow',
            action: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents'
            ],
            resource: ['*']
        }]).map((_) => Object.keys(_)
        .reduce((acc, key) => {
        acc[key.replace(/^\w/, _ => _.toUpperCase())] = _[key];
        return acc;
    }, {}))));
};
