import { Injectable } from "@nestjs/common";
import { readdir } from "node:fs/promises";
import { readdirSync, stat } from "node:fs";

import * as path from "path";
import {
    catchError,
    concat,
    defer,
    EMPTY,
    forkJoin,
    from,
    map,
    mergeAll,
    mergeMap,
    Observable, of,
    switchMap,
    tap
} from "rxjs";
import * as fs from "fs";
import { promisify } from 'util';


@Injectable()
export class AppService {


    private path1: string = '\\\\NAS\\Movies';
    private path2: string = '\\\\NAS\\MoviesB\\Movis';
    private statAsync = promisify(stat);

    getHello(): Observable<{fileName: string, path: string, size: string}[]> {
        // https://stackoverflow.com/questions/39319279/convert-promise-to-observable
        // RxJS wrappers around some of the node fs lib. https://github.com/trxcllnt/rxjs-fs/blob/master/index.js#L41


        try {
            return forkJoin({arr1: readdir(this.path1), arr2: readdir(this.path2)}).pipe(
                map(ob=> [
                    ...this.addPathToName(ob.arr1, this.path1),
                    ...this.addPathToName(ob.arr2, this.path2)
                ]),
                mergeMap((filePaths: string[]) => {
                    const fileStatObservables = filePaths.map(filePath =>
                        from(this.statAsync(filePath)).pipe(
                            map(fileStat => ({
                                fileName: path.basename(filePath),
                                path: filePath,
                                size: fileStat.size.toString()
                            })),
                            catchError(err => {
                                console.error(err);
                                return EMPTY;
                            })
                        )
                    );
                    return forkJoin(fileStatObservables);
                }),
                map(arr=> arr.filter(item =>item.fileName !== '#recycle')),
                tap(ob => console.log("GET all files -> http://localhost:3000", ob[0])),
                catchError(err => {
                    console.error(err);
                    return EMPTY;
                })
            );
        } catch (err) {
            console.error(err);
        }
    }


    public addPathToName (arr: string[], pathToMovies: string): string[] {
        let arrayOfFiles: string[] = [];
        arr.forEach((file) => {
            arrayOfFiles.push(path.join(pathToMovies, file))
        })
        return arrayOfFiles
    }
}
