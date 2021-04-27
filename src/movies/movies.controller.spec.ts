import { Test, TestingModule } from '@nestjs/testing';
import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import * as faker from 'faker';
import { CreateMovieDto } from './dto/create-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService] // MoviesController needs dependency injection
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of movies', async () => {
      const result = [];
      jest.spyOn(service, 'getAll').mockImplementation(() => result);
      expect(await controller.getAll()).toBe(result);
      // controller.getAll();
      // expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', async () => {
      const testMovie: CreateMovieDto = {
        title: faker.name.title(),
        genres: [faker.music.genre()],
        year: faker.datatype.number({min:2000, max:2020})
      };
      service.create(testMovie);
      
      const savedMovie: Movie = {
        id: 1,
        ...testMovie
      };
      const movieGetOneSpy = jest.spyOn(service, 'getOne').mockReturnValue(savedMovie);
      const result = controller.getOne(1);
      
      expect(movieGetOneSpy).toBeCalledWith(1);
      expect(result).toEqual(savedMovie);
      expect(result.title).toEqual(savedMovie.title);
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const testMovieDto : CreateMovieDto = {
        title: faker.name.title(),
        genres: [faker.music.genre()],
        year: faker.datatype.number({min:2000, max:2020})
      }
      const expectedMovie: Movie = {
        id: 1,
        ...testMovieDto
      };
      const movieGetOneSpy = jest.spyOn(service, 'getOne').mockReturnValue(expectedMovie);

      const beforeCreateMovie = service.getAll().length;
      controller.create(testMovieDto);
      const afterCreateMovie = service.getAll().length;
      const result = controller.getOne(1);

      expect(movieGetOneSpy).toBeCalledWith(1);
      expect(result).toEqual(expectedMovie);
      expect(afterCreateMovie).toBeGreaterThan(beforeCreateMovie);      
    });
  });
});
