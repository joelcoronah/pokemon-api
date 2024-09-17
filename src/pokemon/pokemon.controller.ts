import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Pokemon')
@Controller('api/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 100 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  async getPokemons(@Query('limit') limit = 100, @Query('offset') offset = 0) {
    return this.pokemonService.getPokemons(limit, offset);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'ID of the Pokémon' })
  async getPokemonById(@Param('id') id: number) {
    return this.pokemonService.getPokemonById(id);
  }

  @Get('pokemonAndTypes/:id')
  @ApiParam({ name: 'id', required: true, description: 'ID of the Pokémon' })
  async getPokemonAndTypes(@Param('id') id: number) {
    return this.pokemonService.getPokemonAndTypes(id);
  }
}
