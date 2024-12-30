import { ParsedPath } from "path";

export interface IFile {
    type: string,           // 'file' | 'directory'
    children?: IFile[],

    path: string,           // "\\\\NAS\\MoviesB\\TEMP\\A Family Affair (2024) FullHD.mkv"
    path_p: ParsedPath,           // "\\\\NAS\\MoviesB\\TEMP\\A Family Affair (2024) FullHD.mkv"
    titl_p: ITitleParse | null,

    size: IFileSize,
    created: string,
    modified: string,
    access: string,
}


export interface ITitleParse {

    title: string,   // "A Family Affair"
    year: number,    //  2024
    tags: string[],  // ["FullHD"]
    format: string,  //  "mkv"
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
