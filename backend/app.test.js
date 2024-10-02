const request = require('supertest');
const { app, server } = require('./index');

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


afterAll((done) => {
    // Close the server after all tests
    server.close(done);
});