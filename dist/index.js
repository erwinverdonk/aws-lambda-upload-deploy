"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora = require("ora");
const os = require("os");
const fs = require("fs");
const deepmerge = require("deepmerge");
const chalk_1 = require("chalk");
const aws_cloudformation_deploy_1 = require("@erwinverdonk/aws-cloudformation-deploy");
const lib_1 = require("./lib");
const getDefaultOptions = (functionName) => ({
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
const oraPromise = (message, promise) => {
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
};
exports.AwsLambdaUploadDeploy = ($options) => {
    const options = deepmerge(getDefaultOptions($options.functionName), $options, { arrayMerge: (dest, src, opt) => src });
    options.version = options.version.replace(/[^a-z0-9:-]/ig, '-');
    const start = () => {
        oraPromise('Creating Lambda package...', lib_1.createZip({
            input: options.sourcePath,
            output: `${os.tmpdir()}/${options.functionName}.zip`
        }))
            .then((pkg) => __awaiter(this, void 0, void 0, function* () {
            yield oraPromise('Uploading Lambda package...', lib_1.upload({ source: pkg.output, bucketName: options.s3.bucketName }));
            return pkg;
        }))
            .then(pkg => fs.unlinkSync(pkg.output))
            .then(() => aws_cloudformation_deploy_1.AwsCloudFormationDeploy({
            stackName: `Lambda-${options.functionName}`,
            templateBody: lib_1.generateCloudFormationTemplate(options)
        }).start())
            .then(() => ({
            functionName: options.functionName,
            bucketName: options.s3.bucketName
        }))
            .catch(_ => {
            console.error(chalk_1.default.red(_));
        });
    };
    return {
        start
    };
};
