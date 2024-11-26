import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films/films-repository';
import { CreateOrderDTO } from '../dto/order.dto';
import { randomUUID } from 'crypto';

interface ICreateOrderResponse {
  total: number;
  items: {
    film: string;
    session: string;
    daytime: Date;
    row: number;
    seat: number;
    price: number;
    id: string;
  }[];
}

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(
    createOrderDTO: CreateOrderDTO,
  ): Promise<ICreateOrderResponse> {
    const { tickets } = createOrderDTO;
    const orderResponse: ICreateOrderResponse = {
      total: tickets.length,
      items: [],
    };

    for (const ticket of tickets) {
      const { film, session, row, seat, daytime, price } = ticket;

      const filmData = await this.filmsRepository.findById(film);
      if (!filmData) {
        throw new NotFoundException(`Фильм с id ${film} не найден`);
      }

      const filmSchedule = filmData.items.find(
        (schedule) => schedule.id === session,
      );
      if (!filmSchedule) {
        throw new NotFoundException(`Сеанс с id ${session} не найден`);
      }

      const seatTaken = filmSchedule.taken.includes(`${row}:${seat}`);
      if (seatTaken) {
        throw new BadRequestException(`Место ${row}:${seat} уже занято`);
      }

      filmSchedule.taken.push(`${row}:${seat}`);

      await this.filmsRepository.updateFilmSchedule(
        film,
        session,
        filmSchedule.taken,
      );

      const ticketId = randomUUID();
      orderResponse.items.push({
        film,
        session,
        daytime,
        row,
        seat,
        price,
        id: ticketId,
      });
    }

    return orderResponse;
  }
}
