import { Test, TestingModule } from '@nestjs/testing';
import { OmdbController } from './omdb.controller';
import { OmdbService } from './omdb.service';

describe('OmdbController', () => {
  let controller: OmdbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OmdbController],
      providers: [OmdbService],
    }).compile();

    controller = module.get<OmdbController>(OmdbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
