import { IsString } from "class-validator";
// npm i class-validator class-transformer

export class CreateOmdbDto {
    @IsString() readonly imdbID: string;
    @IsString() readonly Title: string;
    @IsString() readonly Year: string;
    @IsString() readonly Rated: string;
    @IsString() readonly Released: string;
    @IsString() readonly Runtime: string;
    @IsString() readonly Genre: string;
    @IsString() readonly Director: string;
    @IsString() readonly Writer: string;
    @IsString() readonly Actors: string;
    @IsString() readonly Plot: string;
    @IsString() readonly Language: string;
    @IsString() readonly Country: string;
    @IsString() readonly Awards: string;
    @IsString() readonly Poster: string;
    @IsString() readonly Metascore: string;
    @IsString() readonly imdbRating: string;
    @IsString() readonly imdbVotes: string;
    @IsString() readonly RotRating: string;
    @IsString() readonly Type: string;
    @IsString() readonly DVD: string;
    @IsString() readonly BoxOffice: string;
    @IsString() readonly Production: string;
    @IsString() readonly Response: string;
    @IsString() readonly Website: string;
}
