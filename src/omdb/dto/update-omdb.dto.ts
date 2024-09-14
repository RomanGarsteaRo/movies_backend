import { PartialType } from '@nestjs/mapped-types';
import { CreateOmdbDto } from './create-omdb.dto';

export class UpdateOmdbDto extends PartialType(CreateOmdbDto) {} // npm i @nestjs/mapped-types
