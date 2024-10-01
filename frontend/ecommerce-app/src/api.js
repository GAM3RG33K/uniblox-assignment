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


export const applyDiscountCoupon = async (userId, discountCode, cart) => {
    try {

        console.log(`applyDiscountCoupon: discountCode : ${discountCode}`);
        const response = await axios.post(`${API_URL}/order/apply-discount`, {
            user_id: userId,
            discount_coupon: discountCode,
            cartItems: Object.values(cart),
        });

        console.log(`applyDiscountCoupon: response : ${JSON.stringify(response.data, 4)}`);
        return response.data;

    } catch (error) {
        console.error('Error while applying discount coupon to cart :', error);
        return { error: error.response.data.error };
    }
};