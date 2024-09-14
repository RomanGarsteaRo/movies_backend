import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Observable } from "rxjs";


/*
TODO
normalize file name in server side
1. exclude two space  "  ".replace(" ")

*/

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): Observable<{fileName: string, path: string, size: string}[]> {
        // console.log('GET 1');
        return this.appService.getHello();
    }
}
