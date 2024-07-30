# Trendmall Backend

## Project Description

Trendmall is a streamlined full-stack application focused on essential functionalities for an e-commerce system. This backend service is built using Nest.js and provides various functionalities such as product management, user authentication, and order processing.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 18.X.X)
- Docker (version 25.X.X)
- PostgreSQL (version 16.X)
- Nest.js CLI (version 10.X.X)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/BRTZL/trendmall-api.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd trendmall-api
   ```

3. **Install the dependencies:**

   ```bash
   yarn install
   ```

4. **Set up the environment variables:**

   Create a `.env` file in the root directory and add the necessary environment variables as specified in the `.env.example` file.

## Usage

### Running the Development Server

To start the development server, run:

```bash
yarn start:dev
```

The server will start on `http://localhost:3001`.

### Running with Docker

1. **Build the Docker image:**

   ```bash
   docker build -t trendmall-backend .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 3001:3001 trendmall-backend
   ```

## API Endpoints

### Auth

- `POST /v1/auth/login`: Log in an existing user
- `POST /v1/auth/register`: Register a new user

### Users

- `GET /v1/users/me`: Retrieve the current user
- `PATCH /v1/users/me`: Update the current user
- `GET /v1/users/{id}`: Retrieve a user by ID
- `PATCH /v1/users/{id}`: Update a user by ID
- `DELETE /v1/users/{id}`: Delete a user by ID

### Categories

- `POST /v1/categories`: Create a new category
- `GET /v1/categories`: Retrieve all categories
- `GET /v1/categories/{id}`: Retrieve a category by ID
- `PATCH /v1/categories/{id}`: Update a category by ID
- `DELETE /v1/categories/{id}`: Delete a category by ID

### Products

- `POST /v1/products`: Create a new product
- `GET /v1/products`: Retrieve all products
- `GET /v1/products/{id}`: Retrieve a product by ID
- `PATCH /v1/products/{id}`: Update a product by ID
- `DELETE /v1/products/{id}`: Delete a product by ID

### Addresses

- `POST /v1/addresses`: Create a new address
- `GET /v1/addresses`: Retrieve all addresses
- `GET /v1/addresses/{id}`: Retrieve an address by ID
- `PATCH /v1/addresses/{id}`: Update an address by ID
- `DELETE /v1/addresses/{id}`: Delete an address by ID

### Cart

- `POST /v1/cart/add`: Add an item to the cart
- `POST /v1/cart/remove`: Remove an item from the cart
- `GET /v1/cart`: Retrieve the current cart

### Orders

- `POST /v1/orders`: Create a new order
- `GET /v1/orders`: Retrieve all orders
- `GET /v1/orders/{id}`: Retrieve an order by ID

## Testing

To run the unit tests, use the following command:

```bash
yarn test
```

## Deployment

To deploy the project using Docker, follow these steps:

1. **Build the Docker image:**

   ```bash
   docker build -t trendmall-backend .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 3000:3000 trendmall-backend
   ```

For detailed deployment guidelines, refer to the Docker documentation.

## Contributing

To contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a Pull Request.
