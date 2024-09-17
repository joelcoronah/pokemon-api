import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, AxiosHeaders } from 'axios'; // Import AxiosHeaders
import { of } from 'rxjs';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('https://pokeapi.co/api/v2'),
          },
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getPokemons', () => {
    it('should return a list of Pokemon names and URLs', async () => {
      const axiosResponse: AxiosResponse = {
        data: {
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(), // Use the AxiosHeaders mock
        config: {
          headers: new AxiosHeaders(), // Use the AxiosHeaders mock here too
        },
      };

      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockReturnValue(of(axiosResponse).toPromise());

      const pokemons = await service.getPokemons(1, 0);
      expect(pokemons).toEqual([
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
      ]);
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=1&offset=0',
      );
    });
  });

  describe('getPokemonById', () => {
    it('should return a specific Pokemon with its types', async () => {
      const axiosResponse: AxiosResponse = {
        data: {
          name: 'bulbasaur',
          types: [
            {
              slot: 1,
              type: {
                name: 'grass',
                url: 'https://pokeapi.co/api/v2/type/12/',
              },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(), // Use the AxiosHeaders mock
        config: {
          headers: new AxiosHeaders(), // Use the AxiosHeaders mock here too
        },
      };

      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockReturnValue(of(axiosResponse).toPromise());

      const pokemon = await service.getPokemonById(1);
      expect(pokemon).toEqual({
        name: 'bulbasaur',
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
        ],
      });
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1',
      );
    });
  });

  describe('getPokemonAndTypes', () => {
    it('should return a Pokemon with its translated types', async () => {
      const pokemonResponse: AxiosResponse = {
        data: {
          name: 'bulbasaur',
          types: [
            {
              slot: 1,
              type: {
                name: 'grass',
                url: 'https://pokeapi.co/api/v2/type/12/',
              },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(), // Use the AxiosHeaders mock
        config: {
          headers: new AxiosHeaders(), // Use the AxiosHeaders mock here too
        },
      };

      const typeResponse: AxiosResponse = {
        data: {
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
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(), // Use the AxiosHeaders mock
        config: {
          headers: new AxiosHeaders(), // Use the AxiosHeaders mock here too
        },
      };

      // Mock the Pokemon data first
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockReturnValueOnce(of(pokemonResponse).toPromise());

      // Mock the translated types data for each type in the Pokemon's types
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockReturnValueOnce(of(typeResponse).toPromise());

      const pokemon = await service.getPokemonAndTypes(1);
      expect(pokemon).toEqual({
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
      });
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1',
      );
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/type/12/',
      );
    });
  });
});
