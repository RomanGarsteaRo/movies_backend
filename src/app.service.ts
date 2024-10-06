import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {

    getHello() {
        return 'This is a base url';
    }
}
