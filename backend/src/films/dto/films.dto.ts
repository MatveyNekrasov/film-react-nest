//TODO описать DTO для запросов к /films
export class getAllFilmsDTO {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
}

export class getFilmSchedule {
  id: string;
  daytime: Date;
  hall: string;
  rows: string;
  seats: number;
  price: number;
  taken: string[];
}
