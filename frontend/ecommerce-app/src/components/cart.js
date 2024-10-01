import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, updateQuantity, removeFromCart }) => {
    const getTotalPrice = () => {
        return Object.values(cart).reduce((total, item) => total + item.price * item.count, 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            {Object.keys(cart).length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {Object.values(cart).map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b py-4">
                            <div className="flex items-center">
                                <img src={item.thumbnail} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                                <div>
                                    <h2 className="text-lg font-semibold">{item.name}</h2>
                                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button
                                    className="bg-gray-200 px-2 py-1 rounded"
                                    onClick={() => updateQuantity(item.id, item.count - 1)}
                                >
                                    -
                                </button>
                                <span className="mx-2">{item.count}</span>
                                <button
                                    className="bg-gray-200 px-2 py-1 rounded"
                                    onClick={() => updateQuantity(item.id, item.count + 1)}
                                >
                                    +
                                </button>
                                <button
                                    className="ml-4 text-red-500"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-8">
                        <p className="text-xl font-bold">Total: ${getTotalPrice().toFixed(2)}</p>
                        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
            <Link to="/" className="mt-8 inline-block text-blue-500 hover:underline">
                Continue Shopping
            </Link>
        </div>
    );
};

export default Cart;