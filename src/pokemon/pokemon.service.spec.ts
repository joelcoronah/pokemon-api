import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        HttpService,
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

  it('should return a list of Pokemon names and URLs', async () => {
    const result = { data: { results: [{ name: 'bulbasaur', url: 'url1' }] } };
    jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(result);

    const pokemons = await service.getPokemons(1, 0);
    expect(pokemons).toEqual([{ name: 'bulbasaur', url: 'url1' }]);
    expect(configService.get).toHaveBeenCalledWith('POKEAPI_URL');
  });

  it('should return a specific Pokemon with its types', async () => {
    const result = {
      data: {
        name: 'bulbasaur',
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
          {
            slot: 2,
            type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
          },
        ],
      },
    };
    jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(result);

    const pokemon = await service.getPokemonById(1);
    expect(pokemon).toEqual({
      name: 'bulbasaur',
      types: [
        {
          slot: 1,
          type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
        },
        {
          slot: 2,
          type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
        },
      ],
    });
  });
});
