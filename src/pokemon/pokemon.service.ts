import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetAllPokemonsResponse,
  PokemonAndType,
  PokemonWithType,
} from './interfaces';

@Injectable()
export class PokemonService {
  private readonly pokeApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.pokeApiUrl = this.configService.get<string>('POKEAPI_URL');
  }

  /**
   * Gets a list of Pokemon names and URLs.
   * @param {number} [limit=100] The maximum number of Pokemon to retrieve.
   * @param {number} [offset=0] The starting index of the Pokemon to retrieve.
   * @returns {Promise<GetAllPokemonsResponse>} A promise that resolves to an array of objects with the Pokemon name and URL.
   */
  async getPokemons(limit = 100, offset = 0): Promise<GetAllPokemonsResponse> {
    const url = `${this.pokeApiUrl}/pokemon?limit=${limit}&offset=${offset}`;
    const response = await this.httpService.axiosRef.get(url);
    return response.data.results.map((pokemon) => ({
      name: pokemon.name,
      url: pokemon.url,
    }));
  }

  /**
   * Gets a specific Pokemon with its types.
   * @param id the Pokemon id
   * @returns a Pokemon with its name and types
   */
  async getPokemonById(id: number): Promise<PokemonWithType> {
    const url = `${this.pokeApiUrl}/pokemon/${id}`;
    const response = await this.httpService.axiosRef.get(url);

    return {
      name: response.data.name,
      types: response.data.types.map((type) => ({
        slot: type.slot,
        type: {
          name: type.type.name,
          url: type.type.url,
        },
      })),
    };
  }

  /**
   * Gets a specific Pokemon with its types, including their translations in Spanish and Japanese.
   * @param id the Pokemon id
   * @returns a Pokemon with its name and types, each with their translations
   */
  async getPokemonAndTypes(id: number): Promise<PokemonAndType> {
    const pokemon = await this.getPokemonById(id);

    const typesWithTranslations = await Promise.all(
      pokemon.types.map(async (type) => {
        const typeResponse = await this.httpService.axiosRef.get(type.type.url);
        const names = typeResponse.data.names
          .filter((nameEntry) => {
            return (
              nameEntry.language.name === 'es' ||
              nameEntry.language.name === 'ja'
            );
          })
          .map((nameEntry) => ({
            language: {
              name: nameEntry.language.name,
              url: nameEntry.language.url,
            },
            name: nameEntry.name,
          }));

        return {
          slot: type.slot,
          type: {
            name: type.type.name,
            url: type.type.url,
            names,
          },
        };
      }),
    );

    return {
      name: pokemon.name,
      types: typesWithTranslations,
    };
  }
}
