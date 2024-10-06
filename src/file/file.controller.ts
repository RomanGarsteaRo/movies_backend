import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { FileService } from "./file.service";
import { Observable } from "rxjs";

@Controller("file")
export class FileController {

    constructor(private readonly fileService: FileService) {}

    // Get all file from all folders
    @Get('all')
    getAll(): Observable<{ fileName: string, path: string, size: string }[]> {
        console.log(`### ...movie/all`);
        return this.fileService.getAll();
    }


    /*
            POST http://localhost:3000/file/files
            Content-Type: application/json

            {
              "folderPath": "\\\\NAS\\Movies"
            }
    */
    @Post('folder')
    getFilesInFolder(@Body() body: { path: string }): Observable<{ fileName: string, path: string, size: string }[]> {
        return this.fileService.getFilesInFolder(body.path);
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
        return this.fileService.metadata(body.path);
    }

}
