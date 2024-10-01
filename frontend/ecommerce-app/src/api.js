import axios from 'axios';

const API_URL = 'http://localhost:9001/api';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data.allProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const addToCard = async (userId, productId) => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data.allProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };