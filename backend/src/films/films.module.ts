import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilmsService } from './service/films.service';
import { FilmsRepository } from 'src/repository/films/films-repository';
import { FilmsController } from './controller/films.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';
import { Film } from 'src/repository/films/films.entity';
import { Schedule } from 'src/repository/films/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<DatabaseType>('DATABASE_DRIVER'),
        url: configService.get<string>('DATABASE_URL'),
        entities: [Film, Schedule],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsRepository],
})
export class FilmsModule {}
