import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOmdbDto } from "./dto/create-omdb.dto";
import { UpdateOmdbDto } from "./dto/update-omdb.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Omdb } from "./entities/omdb.entity";

@Injectable()
export class OmdbService {

    constructor(
        @InjectRepository(Omdb)
        private readonly OmdbRepository: Repository<Omdb>,
    ) {}

    findAll():Promise<Omdb[]> {
        return this.OmdbRepository.find();
    }

    async findOne(imdbID: string) {
        const movie = await this.OmdbRepository.findOne({ where: { imdbID: imdbID } });
        if (!movie) {throw new NotFoundException(`Movie #${imdbID} not found`);}
        return movie;
    }

    create(createMovieDto: CreateOmdbDto) {
        const movie = this.OmdbRepository.create(createMovieDto);
        return this.OmdbRepository.save(movie);
    }

    async update(imdbID: string, updateCoffeeDto: UpdateOmdbDto) {
        const coffee = await this.OmdbRepository.preload({
            imdbID: imdbID,
            ...updateCoffeeDto,
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${imdbID} not found`);
        }
        return this.OmdbRepository.save(coffee);
    }

    async remove(id: string) {
        const coffee = await this.findOne(id);
        return this.OmdbRepository.remove(coffee);
    }
}
