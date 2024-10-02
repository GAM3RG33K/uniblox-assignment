# Express E-Commerce API

This is a simple Express.js-based API for an e-commerce platform. It provides endpoints to manage products, carts, orders, and administrative statistics. The API is designed to work with a product store and allows users to manage their shopping cart, apply discounts, and complete their orders.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) (Node package manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GAM3RG33K/uniblox-assignment.git
   ```

2. Navigate to the project directory:
   ```bash
   cd backend
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

## Running the Server

To run the server locally, use the following command:

```bash
npm start
```

The server will start on port `9001`, and you can access it at `http://localhost:9001`.

## API Endpoints

### GET /

Returns a welcome message.

- **URL**: `/`
- **Method**: `GET`

---

### GET /api/products

Fetches all available products from the product store.

- **URL**: `/api/products`
- **Method**: `GET`

---

### GET /api/cart

Fetches the current cart for a specific user.

- **URL**: `/api/cart`
- **Method**: `GET`
- **Query Parameters**: 
  - `user_id`: The ID of the user whose cart is to be fetched.


---

### POST /api/cart/add

Adds a product to the user's cart.

- **URL**: `/api/cart/add`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "product_id": 101
  }
  ```

---

### POST /api/order/apply-discount

Applies a discount coupon to the user's current cart.

- **URL**: `/api/order/apply-discount`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "discount_coupon": "UNIBLOX_10OFF",
    "cartItems": [ ... ]
  }
  ```

---

### POST /api/order/checkout

Converts the cart items into an order for the user and proceeds with the checkout process.

- **URL**: `/api/order/checkout`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "discount_coupon": "DISCOUNT10",
    "cartItems": [ ... ]
  }
  ```

---

### GET /api/order

Fetches order details based on the order ID.

- **URL**: `/api/order`
- **Method**: `GET`
- **Query Parameters**:
  - `id`: The order ID.
---

### GET /api/admin/stats

Fetches administrative statistics for the system (e.g., total orders).

- **URL**: `/api/admin/stats`
- **Method**: `GET`

---

## Testing

### Running Unit Tests

The project uses **Jest** and **Supertest** for testing.

To run the test suite, use the following command:

```bash
npm test
```

This will execute all unit tests to verify the functionality of the API routes and their business logic.