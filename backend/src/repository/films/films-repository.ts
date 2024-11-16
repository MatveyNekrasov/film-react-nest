import { Model } from 'mongoose';
import { Films, IFilm } from './model/films';
import { GetFilmDTO, GetFilmScheduleDTO } from 'src/films/dto/films.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

interface IFindAllFilmsResponse {
  total: number;
  items: GetFilmDTO[];
}

interface IFilmScheduleResponse {
  total: number;
  items: GetFilmScheduleDTO[];
}

interface IFilmsRepository {
  findAll: () => Promise<IFindAllFilmsResponse>;
  findById: (id: string) => Promise<IFilmScheduleResponse>;
}

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(@InjectModel(Films.name) private filmModel: Model<IFilm>) {}

  private getFilmMapperFn(): (Film) => GetFilmDTO {
    return (root) => ({
      id: root.id,
      rating: root.rating,
      tags: root.tags,
      about: root.about,
      cover: root.cover,
      description: root.description,
      director: root.director,
      image: root.image,
      title: root.title,
    });
  }

  private getFilmScheduleMapperFn(): (Film) => GetFilmScheduleDTO {
    return (root) => ({
      id: root.id,
      daytime: root.daytime,
      hall: root.hall,
      rows: root.rows,
      seats: root.seats,
      price: root.price,
      taken: root.taken,
    });
  }

  async findAll(): Promise<IFindAllFilmsResponse> {
    const items = await this.filmModel.find({});
    const total = await this.filmModel.countDocuments({});
    return {
      total,
      items: items.map(this.getFilmMapperFn()),
    };
  }

  async findById(id: string): Promise<IFilmScheduleResponse> {
    const film = await this.filmModel.findOne({ id });
    return {
      total: film.schedule.length,
      items: film.schedule.map(this.getFilmScheduleMapperFn()),
    };
  }
}
