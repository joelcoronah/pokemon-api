import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            getPokemons: jest.fn(),
            getPokemonById: jest.fn(),
            getPokemonAndTypes: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPokemons', () => {
    it('should call getPokemons from PokemonService with default parameters', async () => {
      const mockPokemons = [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
      ];
      (service.getPokemons as jest.Mock).mockResolvedValue(mockPokemons);

      const result = await controller.getPokemons();
      expect(result).toEqual(mockPokemons);
      expect(service.getPokemons).toHaveBeenCalledWith(100, 0); // Default values for limit and offset
    });

    it('should call getPokemons from PokemonService with provided parameters', async () => {
      const mockPokemons = [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
      ];
      (service.getPokemons as jest.Mock).mockResolvedValue(mockPokemons);

      const limit = 50;
      const offset = 10;
      const result = await controller.getPokemons(limit, offset);
      expect(result).toEqual(mockPokemons);
      expect(service.getPokemons).toHaveBeenCalledWith(limit, offset); // Provided values for limit and offset
    });
  });

  describe('getPokemonById', () => {
    it('should call getPokemonById from PokemonService with the correct ID', async () => {
      const mockPokemon = {
        name: 'bulbasaur',
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
        ],
      };
      (service.getPokemonById as jest.Mock).mockResolvedValue(mockPokemon);

      const result = await controller.getPokemonById(1);
      expect(result).toEqual(mockPokemon);
      expect(service.getPokemonById).toHaveBeenCalledWith(1);
    });
  });

  describe('getPokemonAndTypes', () => {
    it('should call getPokemonAndTypes from PokemonService with the correct ID', async () => {
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
      (service.getPokemonAndTypes as jest.Mock).mockResolvedValue(
        mockPokemonWithTypes,
      );

      const result = await controller.getPokemonAndTypes(1);
      expect(result).toEqual(mockPokemonWithTypes);
      expect(service.getPokemonAndTypes).toHaveBeenCalledWith(1);
    });
  });
});
