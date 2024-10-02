const express = require('express');
const bodyParser = require('body-parser');
const { products } = require('./src/db');
const { addProductToCart, getCart, applyDiscount, checkout, getOrdersFromID, getAdminStatistics } = require('./src/order_manager');
const lodash = require('lodash');
const app = express();

app.use(bodyParser.json());

const cors = require('cors');

const corsOptions = {
    origin(origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (origin === 'http://localhost:3000') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(cors(corsOptions));




// Define the '/' route to respond with a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});


// API to fetch all available products from the product store
app.get('/api/products', (req, res) => {
    const allProducts = lodash.cloneDeep(products);

    res.status(200).json({
        allProducts,
        'count': allProducts.length,
    });
});


// API to fetch cart data for the requesting user
app.get('/api/cart', async (req, res) => {
    const { user_id } = req.query;

    console.log(`incoming request /api/cart: ${req.query}`);

    const response = await getCart(user_id);

    const statusCode = (!response.error) ? 200 : 500;
    console.log(`response on request /api/cart: ${statusCode == 200 ? statusCode : JSON.stringify(response)} `);

    if (statusCode == 200) {
        const cart = response.cart;
        res.status(statusCode).json({
            cart,
            'count': cart.length,
        });
    } else {
        res.status(statusCode).json(response);
    }
});

// API to add product to cart for the requesting user
app.post('/api/cart/add', async (req, res) => {
    const { user_id, product_id } = req.body;

    console.log(`incoming request /api/cart/add: ${req.body}`);

    const response = await addProductToCart(user_id, product_id);
    const statusCode = !(response.error || '') ? 200 : 500;

    console.log(`response on request /api/cart/add: ${statusCode == 200 ? statusCode : JSON.stringify(response)} `);

    res.status(statusCode).json(response);
});

// API to apply discount coupon to current cart for the requesting user
app.post('/api/order/apply-discount', async (req, res) => {
    const { user_id, discount_coupon, cartItems } = req.body;

    console.log(`incoming request /api/order/apply-discount: ${req.body}`);

    const response = await applyDiscount(user_id, discount_coupon, cartItems);
    const statusCode = !(response.error || '') ? 200 : 500;

    console.log(`response on request /api/order/apply-discount: ${statusCode == 200 ? statusCode : JSON.stringify(response)} `);

    res.status(statusCode).json(response);
});


// API to checkout cart items and convert into an order entry
app.post('/api/order/checkout', async (req, res) => {
    const { user_id, discount_coupon, cartItems } = req.body;

    console.log(`incoming request /api/order/checkout: ${req.body}`);

    const response = await checkout(user_id, discount_coupon, cartItems);
    const statusCode = !(response.error || '') ? 200 : 500;

    console.log(`response on request /api/order/checkout: ${statusCode == 200 ? statusCode : JSON.stringify(response)} `);

    res.status(statusCode).json(response);
});


// API to Fetch order details for given order id
app.get('/api/order', async (req, res) => {
    const { id } = req.query;

    console.log(`incoming request /api/order: ${req.query}`);

    const response = await getOrdersFromID(id);
    const statusCode = !(response.error || '') ? 200 : 500;

    console.log(`response on request /api/order: ${statusCode == 200 ? statusCode : JSON.stringify(response)} `);
    res.status(statusCode).json(response);
});

// API to fetch admin statistics
app.get('/api/admin/stats', async (req, res) => {

    console.log(`incoming request /api/admin/stats`);

    const response = await getAdminStatistics();
    const statusCode = !(response.error || '') ? 200 : 500;

    console.log(`response on request /api/admin/stats: ${statusCode == 200 ? statusCode : JSON.stringify(response)} `);
    res.status(statusCode).json(response);
});


const port = 9001;
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = { app, server };
