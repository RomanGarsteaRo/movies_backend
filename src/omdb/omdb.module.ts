import { Module } from '@nestjs/common';
import { OmdbService } from './omdb.service';
import { OmdbController } from './omdb.controller';

@Module({
  controllers: [OmdbController],
  providers: [OmdbService],
})
export class OmdbModule {}
