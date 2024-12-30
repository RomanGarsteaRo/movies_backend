import { Injectable, NotFoundException } from "@nestjs/common";
import { promisify } from "util";
import { stat, rename, unlink } from "node:fs";
import { catchError, EMPTY, forkJoin, from, map, mergeMap, Observable, of, tap, throwError } from "rxjs";
import { readdir } from "node:fs/promises";
import * as path from "path";
import { move } from "fs-extra"; // npm i --save-dev @types/fs-extra
import { join } from 'path';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { extname } from 'path';
import { IFile } from "./file.interface";
import { FileUtils } from "./file.utils";

@Injectable()
export class FileService {


    private path1: string = "\\\\NAS\\Movies";
    private path2: string = "\\\\NAS\\MoviesB\\Movis";
    private statAsync   = promisify(stat);
    private renameAsync = promisify(rename);
    private deleteAsync = promisify(unlink);


    getAll(): Observable<IFile[]> {
        // https://stackoverflow.com/questions/39319279/convert-promise-to-observable
        // RxJS wrappers around some of the node fs lib. https://github.com/trxcllnt/rxjs-fs/blob/master/index.js#L41


        try {
            return forkJoin({ arr1: readdir(this.path1), arr2: readdir(this.path2) }).pipe(
                map(ob => [
                    ...this.addPathToName(ob.arr1, this.path1),
                    ...this.addPathToName(ob.arr2, this.path2)
                ]),
                mergeMap((filePaths: string[]) => {
                    const fileStatObservables = filePaths.map(filePath =>
                        from(this.statAsync(filePath)).pipe(
                            map(stats => ({
                                type: 'file',

                                path: filePath,
                                path_p: path.parse(filePath),
                                titl_p: FileUtils.parseBaseName(path.basename(filePath)),

                                size: FileUtils.convertBytesToIFileSize(stats.size),
                                created: stats.birthtime.toISOString(),
                                modified: stats.mtime.toISOString(),
                                access: stats.atime.toISOString(),
                            })),
                            catchError(err => {
                                console.error(err);
                                return EMPTY;
                            })
                        )
                    );
                    return forkJoin(fileStatObservables);
                }),
                map(arr => arr.filter(item => item.path !== '\\\\NAS\\Movies\\#recycle')),
                catchError(err => {
                    console.error(err);
                    return EMPTY;
                })
            );
        } catch (err) {
            console.error(err);
        }
    }


    /*
    *    dirPath                                                                                   "\\\\NAS\\MoviesB\\TEMP\\"
    *    item                                                                                      "Longlegs (2024) HDrezka.mkv"
    *    fullPath                      path.join(dirPath, item);                                   "\\\\NAS\\MoviesB\\TEMP\\Longlegs (2024) FullHD HDrezka.mkv"
    *    basename + ext                path.basename(filePath)                                     "Longlegs (2024) HDrezka.mkv"
    *    basename                      path.basename(fullPath, path.extname(fullPath))             "Longlegs (2024) HDrezka"
    *
    *
    */
    getDirectoryStructure(dirPath: string): any {
        const structure = [];
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                const entry = {
                    type: 'directory',

                    path: path.resolve(fullPath),
                    path_p: path.parse(fullPath),
                    titl_p: FileUtils.parseBaseName(path.basename(fullPath)),

                    size: FileUtils.convertBytesToIFileSize(0), // Inițial, directorul are dimensiunea 0
                    created: stats.birthtime,
                    modified: stats.mtime,
                    access: stats.atime,
                };

                // Obține structura recursivă a subdirectorului
                entry['children'] = this.getDirectoryStructure(fullPath);

                // Calculăm dimensiunea totală a directorului
                entry.size = FileUtils.convertBytesToIFileSize(
                    entry['children']
                        .map((child) => child.size.sizeInByte || 0) // Adună dimensiunile copiilor (în bytes)
                        .reduce((acc, size) => acc + size, 0) // Dimensiunea totală în bytes
                );

                structure.push(entry);
            } else {
                const fileEntry = {
                    type: 'file',

                    path: path.resolve(fullPath),
                    path_p: path.parse(fullPath),
                    titl_p: FileUtils.parseBaseName(path.basename(fullPath)),

                    size: FileUtils.convertBytesToIFileSize(stats.size), // Dimensiunea fișierului
                    created: stats.birthtime,
                    modified: stats.mtime,
                    access: stats.atime,
                };

                structure.push(fileEntry);
            }
        }

        // Sortare: directoarele înaintea fișierelor
        return [...structure].sort((a, b) => {
            if (a.type === 'directory' && b.type !== 'directory') {
                return -1;
            } else if (a.type !== 'directory' && b.type === 'directory') {
                return 1;
            }
            return 0;
        });
    }


    /*
     *
     *   statAsync(currentPath) — checks if the file exists at the specified path.
     *   mergeMap — if the file exists, it attempts to rename it.
     *   catchError — if the file is not found (error code ENOENT), it returns an error with a message stating that the file does not exist.
     */
    renameFile(currentPath: string, newName: string): Observable<{ oldName: string, newName: string }> {
        const newPath = path.join(path.dirname(currentPath), newName);
        const oldName = path.basename(currentPath);

        return from(this.statAsync(currentPath)).pipe(
            mergeMap(() =>
                from(this.renameAsync(currentPath, newPath)).pipe(
                    map(() => ({ oldName: path.basename(currentPath), newName: newName })),
                    tap(() => console.log(`File renamed: ${currentPath} -> ${newPath}`))
                )
            ),
            catchError(err => {
                if (err.code === 'ENOENT') {
                    console.error(`### File not found: ${currentPath}`);
                    return throwError(() => new NotFoundException(`File not found: ${currentPath}`));
                }
                console.error(err);
                return EMPTY;
            })
        );
    }

    // Transfer file
    moveFile(sourcePath: string, destinationPath: string): Observable<{ oldPath: string, newPath: string }> {
        console.log('### sourcePath', sourcePath);
        console.log('### destinationPath:', destinationPath);

        return from(move(sourcePath, destinationPath)).pipe(
            map(() => ({ oldPath: sourcePath, newPath: destinationPath })),
            tap(() => console.log(`### File moved: ${sourcePath} -> ${destinationPath}`)),
            catchError(err => {
                console.error(err);
                return EMPTY;
            })
        );
    }

    // Delete file
    deleteFile(path: string): Observable<{ path: string }> {
        return from(this.deleteAsync(path)).pipe(
            map(() => ({ path })),
            tap(() => console.log(`### File deleted: ${path}`)),
            catchError(err => {
                console.error(err);
                return EMPTY;
            })
        );
    }

    // Get stats
    // getFolderStats(folderPath: string): Observable<{ totalSize: string, fileCount: number }> {
    getFolderStats(folderPath: string): Observable<any> {
        return from(readdir(folderPath)).pipe(
            // tap(data => console.log('### Files in folder:', data)),
            mergeMap((files: string[]) => {
                // console.log('### files', files);
                const fileStatObservables = files.map(file =>
                    from(this.statAsync(path.join(folderPath, file))).pipe(
                        tap(data => console.log("### data", data)),
                        map(fileStat => ({
                            fileName: file,          // Имя файла
                            fullPath: path.join(folderPath, file),  // Полный путь к файлу
                            size: fileStat.size,     // Размер файла
                            isDirectory: fileStat.isDirectory(),  // Является ли это директорией
                            lastModified: fileStat.mtime // Время последнего изменения
                        })),
                        catchError(err => {
                            console.error(`Error getting stats for ${file}:`, err);
                            return EMPTY;
                        })
                    )
                );

                return forkJoin(fileStatObservables).pipe(
                    map(fileDetails => ({
                        totalSize: fileDetails.reduce((acc, file) => acc + file.size, 0), // Общий размер файлов
                        fileCount: fileDetails.length, // Количество файлов
                        files: fileDetails // Подробная информация о каждом файле
                    }))
                );
            }),
            tap(stats => console.log(`Folder stats for ${folderPath}:`, stats)),
            catchError(err => {
                console.error(`Error reading folder ${folderPath}:`, err);
                return EMPTY;
            })
        );
    }


    // metadata(path: string): Observable<any[]> {
    //     return from(fs.readdir(path)).pipe(
    //         mergeMap(files => {
    //             const metadataObservables = files.map(file => {
    //                 const filePath = join(path, file);
    //                 const fileExtension = extname(file).toLowerCase(); // Получаем расширение файла
    //
    //                 // Определяем, что обрабатываем только медиафайлы (например, .mp4, .mkv, .avi)
    //                 const supportedExtensions = ['.mp4', '.mkv', '.avi', '.mp3']; // Добавьте нужные форматы
    //
    //                 if (!supportedExtensions.includes(fileExtension)) {
    //                     return of(null); // Пропускаем файлы с неподдерживаемым расширением
    //                 }
    //
    //                 return from(fs.stat(filePath)).pipe(
    //                     mergeMap(fileStats => {
    //                         if (fileStats.isFile()) {
    //                             return new Observable(observer => {
    //                                 ffmpeg.ffprobe(filePath, (err, metadata) => {
    //                                     if (err) {
    //                                         // Логируем ошибку и пропускаем файл
    //                                         console.error(`Ошибка чтения метаданных для файла ${filePath}:`, err);
    //                                         observer.next(null); // Пропускаем ошибочные файлы
    //                                         observer.complete();
    //                                     } else {
    //                                         observer.next({ filePath, metadata });
    //                                         observer.complete();
    //                                     }
    //                                 });
    //                             });
    //                         } else {
    //                             return of(null); // Пропускаем если это не файл
    //                         }
    //                     })
    //                 );
    //             });
    //
    //             // Используем forkJoin для ожидания всех Observable
    //             return forkJoin(metadataObservables).pipe(
    //                 map(results => results.filter(Boolean)) // Фильтруем null значения
    //             );
    //         })
    //     );
    // }



    private addPathToName (arr: string[], pathToMovies: string): string[] {
        return arr.map(file => path.join(pathToMovies, file));
    }
}
