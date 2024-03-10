import { Injectable } from "@nestjs/common";
import { readdir } from "node:fs/promises";
import fs from "fs";
import * as path from "path";

@Injectable()
export class AppService {
    async getHello(): Promise<any> {

        // let path: string = '\\\\NAS\\Movies';
        let path: string = 'C:\\Git\\media'  ;

        try {
            const files = await readdir(path);
            for (const file of files) {
                console.log(file);
            }
            return files;
        } catch (err) {
            console.error(err);
        }
    }
}
