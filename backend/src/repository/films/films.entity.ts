import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('double precision', { nullable: false })
  rating: number;

  @Column('varchar', { nullable: false })
  director: string;

  @Column('text', { nullable: false })
  tags: string;

  @Column('varchar', { nullable: false })
  image: string;

  @Column('varchar', { nullable: false })
  cover: string;

  @Column('varchar', { nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  about: string;

  @Column('varchar', { nullable: false })
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedules: Schedule[];
}
