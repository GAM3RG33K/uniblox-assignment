# E-Commerce App

An e-commerce web application that allows users to browse products, add them to a shopping cart, apply discount coupons, and proceed to checkout. The app is built with **React**, uses **React Router** for navigation, and includes various features like product management, cart management, and discount code application.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Browse Products**: View available products, including their descriptions, prices, and images.
- **Add to Cart**: Add products to the cart and manage quantities.
- **Cart Management**: Update product quantities or remove items from the cart.
- **Discounts**: Apply discount codes and see the discounted total.
- **Checkout**: Proceed to checkout and place an order.
- **Responsive Design**: Optimized for mobile and desktop devices.

## Installation

### Prerequisites

- **Node.js** (>= 14.x)
- **npm** (>= 6.x)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/GAM3RG33K/uniblox-assignment.git
   ```

2. Navigate to the project directory:

   ```bash
   cd frontend/ecommerce-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Running the Application

To start the development server, run:

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The app will automatically reload if you make changes to the code.

## Running Tests

The application uses **Jest** and **React Testing Library** for testing.

To run the tests, use the following command:

```bash
npm test
```

Make sure you have configured your testing environment correctly (refer to Jest documentation for custom configuration).

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **React Router**: For client-side routing and navigation.
- **Axios**: For making HTTP requests to fetch products and manage the cart.
- **Jest**: For unit testing.
- **React Testing Library**: For testing React components.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **FontAwesome**: Icon library for cart and other UI elements.