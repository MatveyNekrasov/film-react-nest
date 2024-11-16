import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from '../service/films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getAllFilms() {
    return this.filmsService.findAll();
  }

  @Get('/:id/schedule')
  getFilmById(@Param('id') id: string) {
    return this.filmsService.findById(id);
  }
}
