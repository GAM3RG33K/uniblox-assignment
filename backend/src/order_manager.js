const lodash = require('lodash');
const { v4: uuidv4 } = require('uuid');

const { products, discounts, DISCOUNT_TYPE_PERCENTAGE, NTH_NUMBER } = require('./db');

// In-memory data for managing orders and cart
const carts = {};
const orders = {};

// This provides list of all available discount codes
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


function extractOrderData(orders) {
    let total_purchase_amount = 0;
    let total_discount_amount = 0;
    let total_items_purchased = 0;

    orders.forEach(order => {
        total_purchase_amount += order.subtotal;
        total_discount_amount += order.discountAmount;

        order.products.forEach(product => {
            total_items_purchased += product.count;
        });
    });

    return {
        total_purchase_amount,
        total_discount_amount,
        total_items_purchased
    };
}

async function getAdminStatistics() {

    const allOrders = Object.values(orders).flat();

    const extractedData = extractOrderData(allOrders);
    return {
        ...extractedData,
        discount_codes: Array.from(discountCodes),
    };
};


async function getOrdersForUser(user_id) {

    // check for authentication and valid product
    if (!user_id || !orders[user_id]) {
        return { error: `No orders for ${user_id}` };
    }

    const userOrders = lodash.cloneDeep(orders[user_id]);
    return { orders: userOrders };
};



async function getOrdersFromID(orderId) {

    // check for valid order
    if (!orderId) {
        return { error: `Invalid order id provided` };
    }

    const allOrders = lodash.cloneDeep(Object.values(orders));

    if (!allOrders || !allOrders.length) {
        return { error: `No order details found provided order id` };
    }

    const orders = allOrders.filter((order) => order.id == orderId);
    if (!orders || !orders.length) {
        return { error: `No order details found provided order id` };
    }

    return { order: orders[0] };
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
    const isEligibleForDiscount = userOrdersCount == 0 || (userOrdersCount % NTH_NUMBER == 0);
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

        if (subtotal < discountAmount) {
            return { error: 'Discount can not be applied on this order' };
        }
        return { discountAmount, message: `Discount applied: $${discountAmount.toFixed(2)}` };
    }

    return { error: 'Discount coupon is invalid' };
};


async function checkout(user_id, discount_coupon, cartItems) {

    // check for authentication and valid discount coupon
    if (!user_id || !cartItems) {
        return { error: 'Invalid request' };
    }

    const subtotal = getSubTotalPrice(cartItems);


    var discountAmount = 0;

    var discount = {};
    if (discount_coupon) {
        discount = discounts[discount_coupon];
        discountAmount = getDiscountAmount(subtotal, discount);
    }

    // If subtotal is 0 then no discount can be applied
    if (subtotal <= 0) {
        subtotal = 0;
        discountAmount = 0;
    }

    const order_id = uuidv4();
    var order = {
        id: order_id,
        products: lodash.cloneDeep(cartItems),
        subtotal,
        discountAmount,
        total: subtotal - discountAmount,
        discount,
    }

    // Create an empty cart
    if (!orders[user_id]) {
        orders[user_id] = [];
    }

    orders[user_id].push(order);

    // Clear user cart
    carts[user_id] = {};
    return { message: `Congratulations Order Placed!\n\nOrder ID: ${order_id}` };
};



module.exports = { addProductToCart, getCart, applyDiscount, checkout, getOrdersFromID, getAdminStatistics };