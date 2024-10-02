const request = require('supertest');
const { app, server } = require('./index');

// Mock the order_manager functions
jest.mock('./src/order_manager', () => ({
    addProductToCart: jest.fn(),
    getCart: jest.fn(),
    applyDiscount: jest.fn(),
    checkout: jest.fn(),
    getOrdersFromID: jest.fn(),
    getAdminStatistics: jest.fn(),
}));

const { addProductToCart, getCart, applyDiscount, checkout, getOrdersFromID, getAdminStatistics } = require('./src/order_manager');

// Basic Tests for APIs

describe('GET /', () => {
    it('should return a welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Welcome to the server!');
    });
});

describe('GET /api/products', () => {
    it('should return a list of products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('allProducts');
        expect(res.body.allProducts).toBeInstanceOf(Array);
    });
});

describe('GET /api/cart', () => {
    it('should return the cart for a user', async () => {
        getCart.mockResolvedValue({ cart: [{ id: 1, name: 'Product 1' }], error: null });
        const res = await request(app).get('/api/cart?user_id=1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('cart');
        expect(res.body.cart).toBeInstanceOf(Array);
        expect(res.body.cart[0].name).toBe('Product 1');
    });

    it('should return error if cart retrieval fails', async () => {
        getCart.mockResolvedValue({ error: 'Failed to retrieve cart' });
        const res = await request(app).get('/api/cart?user_id=1');
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('POST /api/cart/add', () => {
    it('should add a product to the cart', async () => {
        addProductToCart.mockResolvedValue({ success: true });
        const res = await request(app)
            .post('/api/cart/add')
            .send({ user_id: 1, product_id: 2 });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ success: true });
    });

    it('should return error if adding product fails', async () => {
        addProductToCart.mockResolvedValue({ error: 'Failed to add product' });
        const res = await request(app)
            .post('/api/cart/add')
            .send({ user_id: 1, product_id: 2 });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('POST /api/order/apply-discount', () => {
    it('should apply discount to the order', async () => {
        applyDiscount.mockResolvedValue({ success: true });
        const res = await request(app)
            .post('/api/order/apply-discount')
            .send({ user_id: 1, discount_coupon: 'DISCOUNT10', cartItems: [] });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ success: true });
    });

    it('should return error if applying discount fails', async () => {
        applyDiscount.mockResolvedValue({ error: 'Invalid coupon' });
        const res = await request(app)
            .post('/api/order/apply-discount')
            .send({ user_id: 1, discount_coupon: 'INVALID', cartItems: [] });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('POST /api/order/checkout', () => {
    it('should checkout the order', async () => {
        checkout.mockResolvedValue({ success: true });
        const res = await request(app)
            .post('/api/order/checkout')
            .send({ user_id: 1, discount_coupon: 'DISCOUNT10', cartItems: [] });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ success: true });
    });

    it('should return error if checkout fails', async () => {
        checkout.mockResolvedValue({ error: 'Failed to checkout' });
        const res = await request(app)
            .post('/api/order/checkout')
            .send({ user_id: 1, discount_coupon: 'DISCOUNT10', cartItems: [] });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('GET /api/order', () => {
    it('should return the order details by order ID', async () => {
        getOrdersFromID.mockResolvedValue({ order: { id: 1, status: 'Completed' } });
        const res = await request(app).get('/api/order?id=1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('order');
        expect(res.body.order.status).toBe('Completed');
    });

    it('should return error if order retrieval fails', async () => {
        getOrdersFromID.mockResolvedValue({ error: 'Order not found' });
        const res = await request(app).get('/api/order?id=1');
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('GET /api/admin/stats', () => {
    it('should return admin statistics', async () => {
        getAdminStatistics.mockResolvedValue({ totalOrders: 100 });
        const res = await request(app).get('/api/admin/stats');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('totalOrders');
    });

    it('should return error if statistics retrieval fails', async () => {
        getAdminStatistics.mockResolvedValue({ error: 'Failed to retrieve stats' });
        const res = await request(app).get('/api/admin/stats');
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});



afterAll((done) => {
    // Close the server after all tests
    server.close(done);
});