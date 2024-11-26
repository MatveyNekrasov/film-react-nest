export class GetFilmDTO {
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

export class GetFilmScheduleDTO {
  id: string;
  daytime: Date;
  hall: string;
  rows: string;
  seats: number;
  price: number;
  taken: string[];
}
