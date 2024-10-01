# Ecommerce Store API (Node.js Version)

This project implements a simple ecommerce store API with cart functionality, checkout process, and discount code generation using Node.js and Express.

## Setup

1. Ensure you have Node.js (version 12+) installed.
2. Install the required dependencies:
   ```
   npm install express body-parser uuid
   ```
3. Run the application:
   ```
   node app.js
   ```

## API Endpoints

### Add to Cart
- URL: `/api/cart/add`
- Method: POST
- Body:
  ```json
  {
    "user_id": "string",
    "item_id": "string",
    "quantity": number
  }
  ```

### Checkout
- URL: `/api/checkout`
- Method: POST
- Body:
  ```json
  {
    "user_id": "string",
    "discount_code": "string" (optional)
  }
  ```

### Admin Stats
- URL: `/api/admin/stats`
- Method: GET

## Features

- In-memory store for items, carts, and orders
- Add items to cart
- Checkout with optional discount code
- Generate discount code for every nth order
- Admin stats API for purchase information

## Assumptions

- The API uses an in-memory store and does not persist data between restarts
- Discount codes are generated for every 3rd order
- Discount codes provide a 10% discount on the total order amount
- Discount codes can only be used once

## Testing

To test the API, you can use tools like Postman or curl to send requests to the endpoints.

To run unit tests:
1. Install dev dependencies: `npm install --save-dev jest supertest`
2. Run the tests: `npm test`

## Next Steps

- Implement data persistence (e.g., with a database)
- Add user authentication and authorization
- Implement more robust error handling
- Add more comprehensive input validation
- Implement a frontend to interact with the API