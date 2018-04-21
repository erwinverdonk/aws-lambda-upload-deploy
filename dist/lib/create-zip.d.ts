export declare const createZip: ({ input, output }: {
    input: string;
    output: string;
}) => Promise<{
    input: string;
    output: string;
    outputSize: number;
}>;
