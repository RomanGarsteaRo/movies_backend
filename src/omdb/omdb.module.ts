import { Module } from '@nestjs/common';
import { OmdbService } from './omdb.service';
import { OmdbController } from './omdb.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Omdb } from "./entities/omdb.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Omdb])],
  controllers: [OmdbController],
  providers: [OmdbService],
})
export class OmdbModule {}
