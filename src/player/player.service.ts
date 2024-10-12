import { Injectable } from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class PlayerService {

    getVideoFilePath(path: string): string {
        if (!fs.existsSync(path)) {
            console.log('File not found', path);
            throw new Error('File not found');
        }
        console.log('File found', path);
        return path;
    }

    getVideoStats(filePath: string) {
        return fs.statSync(filePath);
    }

    createVideoStream(filePath: string, start?: number, end?: number) {
        return fs.createReadStream(filePath, { start, end });
    }
}
