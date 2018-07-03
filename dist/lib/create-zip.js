"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const archiver = require("archiver");
const fs = require("fs");
const zlib = require("zlib");
exports.createZip = ({ input, output }) => {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(output);
        const archive = archiver('zip', {
            zlib: { level: zlib.constants.Z_BEST_COMPRESSION }
        });
        writeStream.on('close', () => {
            resolve({
                input,
                output,
                outputSize: archive.pointer()
            });
        });
        archive.on('warning', err => reject(err));
        archive.pipe(writeStream);
        archive.directory(input, false);
        archive.finalize();
    });
};
