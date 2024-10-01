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

export const fetchCart = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/cart?user_id=${userId}`);
        return response.data.cart;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const addToCard = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_URL}/cart/add`, {
            user_id: userId,
            product_id: productId,
        });

        return response.data.message;

    } catch (error) {
        console.error('Error adding product to cart :', error);
        return [];
    }
};