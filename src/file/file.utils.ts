import { IFile, IFileSize, ITitleParse, SizeUnits } from "./file.interface";
import path from "path";
import fs from "fs";
import * as ffmpeg from 'fluent-ffmpeg';
import { extname } from 'path';

export class FileUtils{

    // Transform basename to IParse
    static parseBaseName(basename: string): ITitleParse {

        const match = basename.match(/^(.+?)\s\((\d{4})\)/);
        const title = match?.[1] || '';
        const year: number = parseInt(match?.[2] || '', 10);
        const tags: string[] = FileUtils.getTagsFromTitle(basename);
        const format = basename.match(/(?:\.([^.]+))?$/)?.[1] || '';

        return {
            title,
            year,
            tags,
            format
        };
    }

    // Bytes to IFileSize
    static convertBytesToIFileSize(bytes: number | IFileSize): IFileSize {
        if (typeof bytes !== "number") {
            return bytes;
        }

        if (bytes === 0) {
            return {
                sizeInByte: 0,
                sizeInUnit: 0,
                unit: "n/a"
            };
        }

        const i: number = Math.floor(Math.log(bytes) / Math.log(1024));
        if (i === 0) {
            return {
                sizeInByte: bytes,
                sizeInUnit: bytes,
                unit: "Bytes"
            };
        } else {
            const unit = Object.keys(SizeUnits)[i];
            return {
                sizeInByte: bytes,
                sizeInUnit: bytes / SizeUnits[unit],
                unit: unit
            };
        }
    }





    static setIFileFromPath(fullPath: string, callback: (path: string) => IFile[]): IFile{
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            // const entry = {
            //     type: 'directory',
            //
            //     path: path.resolve(fullPath),
            //     path_p: path.parse(fullPath),
            //     titl_p: FileUtils.parseBaseName(path.basename(fullPath)),
            //
            //     size: FileUtils.convertBytesToIFileSize(0),
            //     created: stats.birthtime.toString(),
            //     modified: stats.mtime.toString(),
            //     access: stats.atime.toString(),
            // };
            //
            // // Obține structura recursivă a subdirectorului
            // entry['children'] = callback(fullPath);
            //
            // // Calculăm dimensiunea totală a directorului
            // entry.size = FileUtils.convertBytesToIFileSize(
            //     entry['children']
            //         .map((child) => child.size.sizeInByte || 0)     // Adună dimensiunile copiilor (în bytes)
            //         .reduce((acc, size) => acc + size, 0)           // Dimensiunea totală în bytes
            // );
            //
            // return entry;
        } else {
            return  {
                type: 'file',

                path: path.resolve(fullPath),
                path_p: path.parse(fullPath),
                titl_p: FileUtils.parseBaseName(path.basename(fullPath)),

                size: FileUtils.convertBytesToIFileSize(stats.size), // Dimensiunea fișierului
                created: stats.birthtime.toString(),
                modified: stats.mtime.toString(),
                access: stats.atime.toString(),
            };
        }
    }


    // "Blade (1998) 3D ISO.mp4"  ->  ['3D', 'ISO']
    static getTagsFromTitle(id: string): string[] {
        id = id.replace(/.*?\(\d{4}\)/, '').trim();
        id = id.replace(/\.[^.]+$/, '');
        return id.split(' ').filter(item => item !== '');
    }

}