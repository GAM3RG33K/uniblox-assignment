const express = require('express');
const products = require('./db');
const lodash = require('lodash');
const app = express();
const cors = require('cors');

const corsOptions = {
    origin(origin, callback) {
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


const port = 9001;
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.export = app;
