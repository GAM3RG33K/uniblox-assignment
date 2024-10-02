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


app.get('/api/products', (req, res) => {
    const allProducts = lodash.cloneDeep(products);

    res.status(200).json({
        allProducts,
        'count': allProducts.length,
    });
});

app.get('/api/cart', async (req, res) => {
    const { user_id } = req.query;
    const response = await getCart(user_id);
    const statusCode = (!response.error) ? 200 : 500;

    if (statusCode == 200) {
        const cart = response.cart;
        console.log(`total products in cart: ${cart.length}`)
        res.status(statusCode).json({
            cart,
            'count': cart.length,
        });
    } else {
        res.status(statusCode).json(response);
    }
});

app.post('/api/cart/add', async (req, res) => {
    const { user_id, product_id } = req.body;
    const response = await addProductToCart(user_id, product_id);

    const statusCode = !(response.error || '') ? 200 : 500;
    res.status(statusCode).json(response);
});

app.post('/api/order/apply-discount', async (req, res) => {
    const { user_id, discount_coupon, cartItems } = req.body;
    const response = await applyDiscount(user_id, discount_coupon, cartItems);

    const statusCode = !(response.error || '') ? 200 : 500;
    res.status(statusCode).json(response);
});


app.post('/api/order/checkout', async (req, res) => {
    const { user_id, discount_coupon, cartItems } = req.body;
    const response = await checkout(user_id, discount_coupon, cartItems);

    const statusCode = !(response.error || '') ? 200 : 500;
    res.status(statusCode).json(response);
});


app.get('/api/order', async (req, res) => {
    const { id } = req.query;
    const response = await getOrdersFromID(id);
    const statusCode = !(response.error || '') ? 200 : 500;
    res.status(statusCode).json(response);
});

app.get('/api/admin/stats', async (req, res) => {
    const response = await getAdminStatistics();
    const statusCode = !(response.error || '') ? 200 : 500;
    res.status(statusCode).json(response);
});


const port = 9001;
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
