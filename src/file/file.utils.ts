import { IFile, IFileSize, ITitleParse, SizeUnits } from "./file.interface";


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


    // "Blade (1998) 3D ISO.mp4"  ->  ['3D', 'ISO']
    static getTagsFromTitle(id: string): string[] {
        id = id.replace(/.*?\(\d{4}\)/, '').trim();
        id = id.replace(/\.[^.]+$/, '');
        return id.split(' ').filter(item => item !== '');
    }

}