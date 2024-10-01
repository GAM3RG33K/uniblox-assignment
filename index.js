const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// In-memory store
const items = {
    '1': { name: 'Item 1', price: 10.0 },
    '2': { name: 'Item 2', price: 15.0 },
    '3': { name: 'Item 3', price: 20.0 },
};
const carts = {};
const orders = [];
const discountCodes = new Set();
const DISCOUNT_RATE = 0.1;
const NTH_ORDER = 3;

function generateDiscountCode() {
    const code = uuidv4().slice(0, 8);
    discountCodes.add(code);
    return code;
}

app.post('/api/cart/add', (req, res) => {
    const { user_id, item_id, quantity = 1 } = req.body;
    
    if (!user_id || !item_id || !items[item_id]) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    
    if (!carts[user_id]) {
        carts[user_id] = {};
    }
    
    carts[user_id][item_id] = (carts[user_id][item_id] || 0) + quantity;
    
    res.status(200).json({ message: 'Item added to cart successfully' });
});

app.post('/api/checkout', (req, res) => {
    const { user_id, discount_code } = req.body;
    
    if (!user_id || !carts[user_id]) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    
    let total = Object.entries(carts[user_id]).reduce((sum, [item_id, quantity]) => {
        return sum + items[item_id].price * quantity;
    }, 0);
    
    let discountApplied = false;
    if (discount_code && discountCodes.has(discount_code)) {
        total *= (1 - DISCOUNT_RATE);
        discountCodes.delete(discount_code);
        discountApplied = true;
    }
    
    const order = {
        user_id,
        items: { ...carts[user_id] },
        total,
        discount_applied: discountApplied
    };
    orders.push(order);
    delete carts[user_id];
    
    const response = { message: 'Order placed successfully', total };
    
    if (orders.length % NTH_ORDER === 0) {
        const newDiscountCode = generateDiscountCode();
        response.discount_code = newDiscountCode;
    }
    
    res.status(200).json(response);
});

app.get('/api/admin/stats', (req, res) => {
    const totalItemsPurchased = orders.reduce((sum, order) => {
        return sum + Object.values(order.items).reduce((itemSum, quantity) => itemSum + quantity, 0);
    }, 0);
    
    const totalPurchaseAmount = orders.reduce((sum, order) => sum + order.total, 0);
    
    const totalDiscountAmount = orders.reduce((sum, order) => {
        return sum + (order.discount_applied ? order.total * DISCOUNT_RATE / (1 - DISCOUNT_RATE) : 0);
    }, 0);
    
    res.status(200).json({
        total_items_purchased: totalItemsPurchased,
        total_purchase_amount: totalPurchaseAmount,
        discount_codes: Array.from(discountCodes),
        total_discount_amount: totalDiscountAmount
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;