import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { fetchProducts, fetchCart } from './api';

// Mock API functions
jest.mock('./api', () => ({
  fetchProducts: jest.fn(),
  fetchCart: jest.fn(),
}));

jest.mock('./index', () => ({
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
});
