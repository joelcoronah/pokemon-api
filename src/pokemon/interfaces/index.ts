export interface GetAllPokemonsResponse {
  name: string;
  url: string;
}

export interface PokemonWithType {
  name: string;
  types: TypeElement[];
}

export interface TypeElement {
  slot: number;
  type: TypeType;
}

export interface TypeType {
  name: string;
  url: string;
}

export interface PokemonAndType {
  name: string;
  types: TypeElement[];
}

export interface TypeElement {
  slot: number;
  type: TypeType;
}

export interface TypeType {
  name: string;
  url: string;
  names: Name[];
}

export interface Name {
  language: Language;
  name: string;
}

export interface Language {
  name: string;
  url: string;
}
