import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import * as fs from "fs";
import { Observable } from "rxjs";


@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}


    @Get()
    getHello(): Observable<any> {
        return this.appService.getHello();
    }
}
