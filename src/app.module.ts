import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FileModule } from './file/file.module';
import { OmdbModule } from './omdb/omdb.module';


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mariadb", // type of our database
            host: "127.0.0.1", // database host
            port: 3306, // database host
            username: "root", // username
            password: "12345", // user password
            database: "mymovies", // name of our database,
            autoLoadEntities: true, // models will be loaded automatically
            synchronize: true // your entities will be synced with the database(recommended: disable in prod)
        }),

        OmdbModule,
        FileModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
}
