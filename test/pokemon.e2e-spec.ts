import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module'; // Adjust path based on your project structure
import { PokemonService } from './../src/pokemon/pokemon.service';

describe('PokemonController (e2e)', () => {
  let app: INestApplication;
  let pokemonService = {
    getPokemons: jest.fn(),
    getPokemonById: jest.fn(),
    getPokemonAndTypes: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PokemonService)
      .useValue(pokemonService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/pokemon (GET)', () => {
    it('should return a list of Pokemon', () => {
      const mockPokemons = [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
      ];
      pokemonService.getPokemons.mockResolvedValue(mockPokemons);

      return request(app.getHttpServer())
        .get('/api/pokemon?limit=1&offset=0')
        .expect(200)
        .expect(mockPokemons);
    });
  });

  describe('/api/pokemon/:id (GET)', () => {
    it('should return a specific Pokemon by ID', () => {
      const mockPokemon = {
        name: 'bulbasaur',
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
        ],
      };
      pokemonService.getPokemonById.mockResolvedValue(mockPokemon);

      return request(app.getHttpServer())
        .get('/api/pokemon/1')
        .expect(200)
        .expect(mockPokemon);
    });
  });

  describe('/api/pokemonAndTypes/:id (GET)', () => {
    it('should return a Pokemon with translated types', () => {
      const mockPokemonWithTypes = {
        name: 'bulbasaur',
        types: [
          {
            slot: 1,
            type: {
              name: 'grass',
              url: 'https://pokeapi.co/api/v2/type/12/',
              names: [
                {
                  language: {
                    name: 'es',
                    url: 'https://pokeapi.co/api/v2/language/7/',
                  },
                  name: 'Planta',
                },
                {
                  language: {
                    name: 'ja',
                    url: 'https://pokeapi.co/api/v2/language/11/',
                  },
                  name: 'くさ',
                },
              ],
            },
          },
        ],
      };

      pokemonService.getPokemonAndTypes.mockResolvedValue(mockPokemonWithTypes);

      return request(app.getHttpServer())
        .get('/api/pokemon/pokemonAndTypes/1')
        .expect(200)
        .expect(mockPokemonWithTypes);
    });
  });
});
