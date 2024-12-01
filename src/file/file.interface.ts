import path from "path";

export interface IFileBase {
    path: string,
    basename: string,
    size: number,
}

export interface IFile {
    path: string,
    size: IFileSize,

    title: string,
    year: number,
    tags: string[],
    format: string,
}

export interface IFileSize {
    sizeInByte: number,
    sizeInUnit: number;
    unit: string;
}

export const SizeUnits: { [key: string]: number } = {
    Bytes: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024
};
