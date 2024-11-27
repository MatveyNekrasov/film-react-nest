import { GetFilmDTO, GetFilmScheduleDTO } from 'src/films/dto/films.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './films.entity';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

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
  updateFilmSchedule: (
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ) => Promise<void>;
}

/* @Injectable()
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

  async updateFilmSchedule(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<void> {
    await this.filmModel.updateOne(
      {
        id: filmId,
        'schedule.id': sessionId,
      },
      { $set: { 'schedule.$.taken': takenSeats } },
    );
  }
} */

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

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
      taken: root.taken.split(';').filter(Boolean),
    });
  }

  async findAll(): Promise<IFindAllFilmsResponse> {
    const [items, total] = await this.filmRepository.findAndCount();
    return {
      total,
      items: items.map(this.getFilmMapperFn()),
    };
  }

  async findById(id: string): Promise<IFilmScheduleResponse> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });

    const sortedSchedules = film.schedules.sort((a, b) => {
      return new Date(a.daytime).getTime() - new Date(b.daytime).getTime();
    });

    return {
      total: sortedSchedules.length,
      items: sortedSchedules.map(this.getFilmScheduleMapperFn()),
    };
  }

  async updateFilmSchedule(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<void> {
    await this.scheduleRepository.update(
      { id: sessionId, film: { id: filmId } },
      { taken: takenSeats.join(';') },
    );
  }
}
