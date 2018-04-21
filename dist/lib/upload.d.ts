export declare const upload: ({ source, bucketName, path }: {
    source: string;
    bucketName: string;
    path?: string;
}) => Promise<{
    bucketName: string;
    fileKey: string;
}>;
