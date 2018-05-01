"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
exports.checkLambdaExists = ({ functionName }) => {
    const lambda = new AWS.Lambda();
    return lambda.getFunction({
        FunctionName: functionName
    })
        .promise()
        .then(_ => true)
        .catch(_ => false);
};
