import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { FileService } from "./file.service";
import { Observable, throwError } from "rxjs";
import { IFile } from "./file.interface";

@Controller("file")
export class FileController {

    constructor(private readonly fileService: FileService) {}


    // Get all file from all folders
    @Get('all')
    getAll(): Observable<IFile[]> {
        //console.log(`### ...movie/all`);
        return this.fileService.getAll();
    }



    /*
     *      POST http://localhost:3000/file/files
     *      Content-Type: application/json
     *      path": "\\\\NAS\\Movies"
     *
     *      Get structure of directory by path
     *      http://localhost:3000/file/structure?path=\\NAS\MoviesB\TEMP&depth=1
     *
     *      [ {
     *              "name":         "Longlegs (2024) HDrezka.mkv",
     *              "type":         "file",
     *              "extension":    ".mkv",
     *              "path":         "\\\\NAS\\MoviesB\\TEMP\\ Longlegs (2024) HDrezka.mkv",
     *              "size":         7229165374,
     *              "created":      "2024-08-25T17:46:49.549Z",
     *              "modified":     "2024-08-25T18:27:26.973Z",
     *              "access":       "2024-09-07T19:52:56.889Z"
     *        },...
     *      ]
     */
    @Post('folder')
    getFilesInFolder(@Body() body: { path: string }): Observable<IFile[]> {
        const { path: dirPath} = body;

        if (!dirPath) {
            return throwError(() => new Error('Path is required'));
        }

        try {
            return this.fileService.getDirectoryStructure(dirPath);
        } catch (error) {
            return throwError(() => new Error('Invalid path or access denied'));
        }
    }


    // Rename file
    @Post('rename')
    renameFile(@Body() body: { currentPath: string, newName: string }): Observable<{ oldName: string, newName: string }> {
        return this.fileService.renameFile(body.currentPath, body.newName);
    }


    // Get folder stat
    @Post('stats')
    getFolderStats(@Body() body: { path: string }): Observable<any> {
        return this.fileService.getFolderStats(body.path);
    }

    // Delete file
    @Delete('delete')
    deleteFile(@Body() body: { path: string }): Observable<{ path: string }> {
        return this.fileService.deleteFile(body.path);
    }

    // Move file
    @Post('move')
    moveFile(@Body() body: { sourcePath: string, destinationPath: string }): Observable<{ oldPath: string, newPath: string }> {
        return this.fileService.moveFile(body.sourcePath, body.destinationPath);
    }

    @Post('meta')
    getMetadata(@Body() body: { path: string }) {
        console.log(`### ...movie/meta  path: ${body.path}`);
        // return this.fileService.metadata(body.path);
    }

}
