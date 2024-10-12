import { Body, Controller, Get, Query, Req, Res } from "@nestjs/common";
import { PlayerService } from "./player.service";
import { Response, Request } from 'express';

@Controller("player")
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @Get('play')
    async getVideo(
        @Query('filename') filename: string,
        @Res() res: Response,
        @Req() req: Request
    ) {
        try {
            const filePath = this.playerService.getVideoFilePath(filename);
            const stat = this.playerService.getVideoStats(filePath);
            const fileSize = stat.size;
            const range = req.headers['range'] as string | undefined;

            if (range) {
                console.log('11111111');
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunkSize = (end - start) + 1;
                const fileStream = this.playerService.createVideoStream(filePath, start, end);
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/x-msvideo',
                };
                res.status(206).set(head).send(fileStream);
            } else {
                console.log('2222222');
                // console.log(filePath);
                // console.log(stat);
                // console.log(fileSize);
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/x-msvideo',
                };
                res.writeHead(200, head);
                const fileStream = this.playerService.createVideoStream(filePath);
                fileStream.pipe(res);
            }
        } catch (error) {
            res.status(404).send('File not found');
        }
    }
}
