import { Injectable } from "@nestjs/common";
import { readdir } from "node:fs/promises";
import fs from "fs";
import * as path from "path";
import { concat, defer, forkJoin, map, mergeAll, Observable, switchMap } from "rxjs";

@Injectable()
export class AppService {

    // private path: string = '\\\\NAS\\Movies';
    private path1: string = 'C:\\Git\\media1'  ;
    private path2: string = 'C:\\Git\\media2'  ;

    getHello(): Observable<any> {
        // https://stackoverflow.com/questions/39319279/convert-promise-to-observable
        // RxJS wrappers around some of the node fs lib. https://github.com/trxcllnt/rxjs-fs/blob/master/index.js#L41

        try {
            // var 1
            // return defer(() => readdir(this.path));

            // var 2
            return forkJoin({arr1: readdir(this.path2), arr2: readdir(this.path1)}).pipe(map(ob=> [...ob.arr1, ...ob.arr2]));


        } catch (err) {
            console.error(err);
        }
    }

    // private readdir(dir) {
    //
    //     return Rx.Observable.create(function(observer) {
    //
    //         fs.readdir(dir, cb);
    //
    //         function cb(e, files) {
    //             if(e) files = [];
    //             files = _.map(files, _.partial(setFullPath, dir));
    //             observer.onNext(files);
    //             observer.onCompleted();
    //         }
    //     });
    // };

}
