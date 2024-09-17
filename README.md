# Pokémon API

This project is a RESTful API built with **NestJS** that connects to the **PokeAPI** to retrieve information about Pokémon.

## Requirements

- Node.js v18 or higher
- npm or yarn

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/pokemon-api.git
   cd pokemon-api
   ```

2. Install the dependencies

   ```bash
   npm i
   ```

3. Create a .env file:

   ```bash
   POKEAPI_URL=https://pokeapi.co/api/v2
   ```

## How to Run the API

To run the API in development mode:

```bash
npm run start:dev
```

The API will run on http://localhost:3000.

## API Documentation (Swagger)

To access the Swagger documentation for the API, navigate to:

```bash
 http://localhost:3000/api
```

### Available Endpoints

#### 1. Get a List of Pokemon

- Endpoint: `/api/pokemon`
- Method: `GET`
- Description: Fetches a list of the first 100 Pokemon with their name and URL.
- Parameters:
  - `limit` (optional): The maximum number of Pokemon to return. Default: `100`.
  - `offset` (optional): The number of Pokemon to skip. Default: `0`.

#### 2. Get a Specific Pokemon by ID

- Endpoint: `/api/pokemon/:id`
- Method: `GET`
- Description: Fetches details of a specific Pokemon, including its name and types.

#### 3. Get a Pokemon with Translated Types

- Endpoint: `/api/pokemonAndTypes/:id`
- Method: `GET`
- Description: Fetches details of a specific Pokemon, including its name, types, and the translations of each type in Spanish and Japanese.

## Testing

### Unit Tests

```bash
npm run test
```

### End-to-End (E2E) Tests

```bash
npm run test:e2e
```

### Overview of Tools and Frameworks Used:

- **NestJS**: Backend framework to build scalable server-side applications in Node.js.
- **Axios**: Used to make HTTP requests to the PokeAPI.
- **Swagger**: Automatically generates API documentation for the available endpoints.
- **@nestjs/config**: A library in NestJS for managing environment variables, such as the PokeAPI URL.
- **Jest**: Testing framework used for running both unit and e2e tests.
