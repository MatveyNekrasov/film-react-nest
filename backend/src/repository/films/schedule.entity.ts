import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Film } from './films.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  daytime: string;

  @Column('integer', { nullable: false })
  hall: number;

  @Column('integer', { nullable: false })
  rows: number;

  @Column('integer', { nullable: false })
  seats: number;

  @Column('double precision', { nullable: false })
  price: number;

  @Column('text', { nullable: false })
  taken: string;

  @ManyToOne(() => Film, (film) => film.schedules)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
