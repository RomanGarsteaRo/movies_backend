import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // all those unwanted or invalid properties are automatically stripped out and removed
        transform: true, // Transform object to class DTO (createMovieDto instanceof CreateMovieDto)
        forbidNonWhitelisted: true, // send error 'this property not exist'
    }));
    app.enableCors({
        origin: ['http://localhost:4200', 'http://localhost:4455'],
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type,Authorization,access-control-allow-origin',
    });
    await app.listen(3000);
}

bootstrap();
