import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
   * @param limit the maximum number of Pokemon to return
   * @param offset the number of Pokemon to skip before returning Pokemon
   * @returns a list of Pokemon with their names and URLs
   */
  async getPokemons(limit = 100, offset = 0) {
    const url = `${this.pokeApiUrl}/pokemon?limit=${limit}&offset=${offset}`;
    const response = await this.httpService.axiosRef.get(url);
    return response.data.results.map((pokemon) => ({
      name: pokemon.name,
      url: pokemon.url,
    }));
  }

  /**
   * Gets a Pokemon by its id.
   * @param id the Pokemon id
   * @returns a Pokemon with its name and types
   */
  async getPokemonById(id: number) {
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
   * Gets a Pokemon with its name and types, including their names translated to Spanish and Japanese.
   * @param id the Pokemon id
   * @returns a Pokemon with its name and types with their names translated to Spanish and Japanese
   */
  async getPokemonAndTypes(id: number) {
    const pokemon = await this.getPokemonById(id);

    // Obtener los nombres traducidos de los tipos
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
