const products = require('./db');

// In-memory data for managing orders and cart
const carts = {};


async function addProductToCart(user_id, product_id) {

    // check for authentication and valid product
    if (!user_id || !product_id || !products[product_id]) {
        return { error: 'Invalid request' };
    }

    // Create an empty cart
    if (!carts[user_id]) {
        carts[user_id] = {};
    }

    // Update quantity
    carts[user_id][product_id] = (carts[user_id][product_id] || 0) + 1;

    console.log(`${user_id} added ${product_id} into their cart!!!`);
    return { message: 'Product added to cart successfully' };
};




async function getCart(user_id) {

    // check for authentication and valid product
    if (!user_id || !carts[user_id]) {
        return { error: `No cart details for ${user_id}` };
    }

    const cartData = carts[user_id];
    const productsInCart = Object.keys(cartData);
    
    console.log(`${user_id} has ${productsInCart.length} unique products in their cart!`);


    const cart = [];

    productsInCart.forEach(product_id => {
        const filteredProducts = products.filter((product) => {
            return product.id == product_id;
        });

        if (filteredProducts && filteredProducts.length) {
            const count = cartData[product_id] || 0;
            for (var i = 0; i < count; i++) {
                cart.push(filteredProducts[0]);
            }
        }
    });
    return { cart };
};

module.exports = { addProductToCart, getCart };