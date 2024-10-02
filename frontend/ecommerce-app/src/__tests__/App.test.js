import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import Cart from '../components/cart';
import { fetchProducts, fetchCart, addToCard } from '../api';
import { MemoryRouter } from 'react-router-dom';

// Mock API functions
jest.mock('../api', () => ({
  fetchProducts: jest.fn(),
  fetchCart: jest.fn(),
  addToCard: jest.fn(),
}));

jest.mock('../index', () => ({
  userId: 1,
}));


describe('App Component', () => {
  beforeEach(() => {
    fetchProducts.mockResolvedValue([
      { id: 1, name: 'Product 1', description: 'Description 1', price: 10.0, thumbnail: '/img1.jpg' },
      { id: 2, name: 'Product 2', description: 'Description 2', price: 20.0, thumbnail: '/img2.jpg' },
    ]);

    fetchCart.mockResolvedValue([]);
  });

  test('renders product list', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });



  test('adds product to cart', async () => {
    addToCard.mockResolvedValue(true);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const addButton = screen.getAllByText(/Add to Cart/i)[0];
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addToCard).toHaveBeenCalledWith(1, 1);
    });
  });

  test('fetches and updates cart on load', async () => {
    fetchCart.mockResolvedValue([
      { id: 1, name: 'Product 1', price: 10.0, thumbnail: '/img1.jpg' },
      { id: 1, name: 'Product 1', price: 10.0, thumbnail: '/img1.jpg' },
    ]);

    render(<App />);


    await waitFor(() => {
      expect(fetchCart).toHaveBeenCalledWith(1);
    });
  });

});

describe('Cart Component', () => {
  const mockRemoveFromCart = jest.fn();
  const mockUpdateQuantity = jest.fn();

  const mockCart = {
    1: {
      id: 1,
      name: 'Product 1',
      price: 10.0,
      count: 2,
      thumbnail: '/img1.jpg',
    },
    2: {
      id: 2,
      name: 'Product 2',
      price: 20.0,
      count: 1,
      thumbnail: '/img2.jpg',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders cart with products and handles product removal', () => {

    render(
      <MemoryRouter>
        <Cart
          cart={mockCart}
          updateQuantity={mockUpdateQuantity}
          removeFromCart={mockRemoveFromCart}
        />
      </MemoryRouter>
    );


    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();


    const removeButtons = screen.getAllByText(/Remove/i);
    fireEvent.click(removeButtons[0]);


    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);


    expect(screen.queryByText(/Discount applied/i)).not.toBeInTheDocument();
  });

  test('displays empty cart message when no items are in the cart', () => {

    render(<MemoryRouter><Cart cart={{}} updateQuantity={mockUpdateQuantity} removeFromCart={mockRemoveFromCart} /></MemoryRouter>);


    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });
});