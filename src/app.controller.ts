import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";


/*
TODO
normalize file name in server side
1. exclude two space  "  ".replace(" ")

*/

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
