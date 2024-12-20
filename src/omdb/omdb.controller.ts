import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { OmdbService } from "./omdb.service";
import { CreateOmdbDto } from "./dto/create-omdb.dto";
import { UpdateOmdbDto } from "./dto/update-omdb.dto";


@Controller("omdb")
export class OmdbController {
    constructor(private readonly omdbService: OmdbService) {}


    @Get()
    findAll() {
        // console.log('### GET all omdb from DB http://localhost:3000/omdb');
        return this.omdbService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.omdbService.findOne(id);
    }

    @Post()
    create(@Body() createMovieDTO: CreateOmdbDto) {
        console.log('POST:', createMovieDTO);
        return this.omdbService.create(createMovieDTO);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDTO: UpdateOmdbDto) {
        return this.omdbService.update(id, updateCoffeeDTO);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.omdbService.remove(id);
    }
}
