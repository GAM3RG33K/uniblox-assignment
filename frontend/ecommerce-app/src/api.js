import axios from 'axios';

const API_URL = 'http://localhost:9001/api';

// Fetch products api call, this only fetches the available products
export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data.allProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};


// Fetch cart api call, this fetches the cart details for the userId
export const fetchCart = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/cart?user_id=${userId}`);
        return response.data.cart;
    } catch (error) {
        console.error('Error fetching products in cart:', error);
        return [];
    }
};


// Add to cart api call, this adds product to the cart
// This happens on individual product addition, 
// this should be called on every product count update
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

// Apply discount coupon to an order
// 
// This api may or may not apply discount coupon based on the decision by 
// the backend logic, although user can request to apply coupon on every order
export const applyDiscountCoupon = async (userId, discountCode, cart) => {
    try {
        const response = await axios.post(`${API_URL}/order/apply-discount`, {
            user_id: userId,
            discount_coupon: discountCode,
            cartItems: Object.values(cart),
        });

        return response.data;

    } catch (error) {
        console.error('Error while applying discount coupon to cart :', error);
        return { error: error.response.data.error };
    }
};


// Checkout api call, This sends the processed cart details,
// including the discount coupon applied if any.
//
// Note: If discount coupon is provided it is assumed that it has been verified before this
export const checkout = async (userId, discountCode, cart) => {
    try {
        const response = await axios.post(`${API_URL}/order/checkout`, {
            user_id: userId,
            discount_coupon: discountCode,
            cartItems: Object.values(cart),
        });

        return response.data;

    } catch (error) {
        console.error('Error while Placing the order:', error);
        return { error: error.response.data.error };
    }
};