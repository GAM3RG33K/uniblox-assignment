const lodash = require('lodash');

const { products, discounts, DISCOUNT_TYPE_PERCENTAGE, NTH_NUMBER } = require('./db');

// In-memory data for managing orders and cart
const carts = {};
const orders = {};

const discountCodes = Object.keys(discounts);

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

    // Add Products with entire product data in cart
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


async function getOrdersForUser(user_id) {

    // check for authentication and valid product
    if (!user_id || !orders[user_id]) {
        return { error: `No orders for ${user_id}` };
    }

    const userOrders = lodash.cloneDeep(orders[user_id]);
    return { orders: userOrders };
};



const getSubTotalPrice = (cartItems) => {
    if (!(cartItems && cartItems.length)) return 0;
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.count, 0);
    return subtotal;
};

const getDiscountAmount = (subtotal, discount) => {
    if (discount.type === DISCOUNT_TYPE_PERCENTAGE) {
        return (subtotal * (discount.value)) / 100;
    }
    return discount.value;
};



const getOrdersCountForUser = async (user_id) => {
    const userOrders = await getOrdersForUser(user_id);
    const count = userOrders?.orders?.length || 0;
    return count;
};



const checkDiscountEligibility = async (user_id) => {
    const userOrdersCount = await getOrdersCountForUser(user_id);
    const isEligibleForDiscount = userOrdersCount == 0 || (userOrders.orders.length % NTH_NUMBER == 0);
    return isEligibleForDiscount;
};


async function applyDiscount(user_id, discount_coupon, cartItems) {

    // check for authentication and valid discount coupon
    if (!user_id || !discount_coupon) {
        return { error: 'Invalid request' };
    }

    const isEligibleForDiscount = await checkDiscountEligibility(user_id);

    if (!isEligibleForDiscount) {
        return { error: 'Order not eligible for discount, Please try later' };
    }

    const subtotal = getSubTotalPrice(cartItems);

    // If subtotal is 0 then no discount can be applied
    if (subtotal <= 0) return 0;

    if (discountCodes.includes(discount_coupon)) {
        const discount = discounts[discount_coupon];

        const discountAmount = getDiscountAmount(subtotal, discount);
        return { discountAmount, message: `Discount applied: $${discountAmount.toFixed(2)}` };
    }

    return { error: 'Discount coupon is invalid' };
};

module.exports = { addProductToCart, getCart, applyDiscount };