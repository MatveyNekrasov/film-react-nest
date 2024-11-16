import { Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films/films-repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll() {
    return this.filmsRepository.findAll();
  }

  async findById(id: string) {
    return this.filmsRepository.findById(id);
  }
}
