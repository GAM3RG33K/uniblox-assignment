import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { applyDiscountCoupon, checkout } from '../api';
import { userId } from '..';

const Cart = ({ cart, updateQuantity, removeFromCart }) => {
    const [discountCode, setDiscountCode] = useState('');
    const [discountMessage, setDiscountMessage] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);

    const [alert, setAlert] = useState({ show: false, message: '', isError: false });

    const navigate = useNavigate();

    const closeAlert = () => {
        if (alert.show && !alert.isError) {
            navigate('/');

            // Force a page refresh
            window.location.reload();
        }
        setAlert({ ...alert, show: false });
    };


    const resetDiscount = () => {
        setDiscountAmount(0);
        setDiscountMessage(``);
        setDiscountCode(``);
    };

    const updateProduct = (itemId, itemCount) => {
        updateQuantity(itemId, itemCount);
        resetDiscount();
    };


    const removeProduct = (itemId) => {
        removeFromCart(itemId);
        resetDiscount();
    };

    const getSubTotalPrice = () => {
        const subtotal = Object.values(cart).reduce((total, item) => total + item.price * item.count, 0);
        return subtotal;
    };

    const getTotalPrice = () => {
        const subtotal = getSubTotalPrice();
        return subtotal - discountAmount;
    };



    const applyDiscount = async (userId, couponCode) => {

        try {
            const response = await applyDiscountCoupon(userId, couponCode, cart);
            if (response && !response.error) {
                setDiscountAmount(response.discountAmount);
                setDiscountMessage(`Discount applied: $${response.discountAmount.toFixed(2)}`);
            } else {
                setDiscountAmount(0);
                setDiscountMessage(response.error);
            }
        } catch (error) {
            console.error('Error applying discount:', error);
            setDiscountMessage('Error applying discount');
        }
    };

    const checkoutOrder = async (userId) => {
        try {
            const response = await checkout(userId, discountCode, cart);
            if (response && !response.error) {
                setAlert({ show: true, message: response.message, isError: false });
            } else {
                setAlert({ show: true, message: response.error, isError: true });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setAlert({ show: true, message: 'Unable to place order right now, Please try again later!', isError: true });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            {alert.show && (
                <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className={`text-lg font-semibold mb-2 ${alert.isError ? 'text-red-600' : 'text-green-600'}`}>
                            {alert.isError ? 'Error' : 'Success'}
                        </h2>
                        <p className="mb-4">{alert.message}</p>
                        <button
                            onClick={closeAlert}
                            className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
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
                                    onClick={() => updateProduct(item.id, item.count - 1)}
                                >
                                    -
                                </button>
                                <span className="mx-2">{item.count}</span>
                                <button
                                    className="bg-gray-200 px-2 py-1 rounded"
                                    onClick={() => updateProduct(item.id, item.count + 1)}
                                >
                                    +
                                </button>
                                <button
                                    className="ml-4 text-red-500"
                                    onClick={() => removeProduct(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-8">
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                placeholder="Enter discount code"
                                className="border p-2 mr-2"
                            />
                            <button
                                onClick={() => applyDiscount(userId, discountCode)}
                                className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                        {discountMessage && (
                            <p className={discountAmount > 0 ? "text-green-500" : "text-red-500"}>
                                {discountMessage}
                            </p>
                        )}
                        <p className="text-m mt-4">SubTotal: ${getSubTotalPrice().toFixed(2)}</p>
                        <p className="text-xl font-bold mt-4">Total: ${getTotalPrice().toFixed(2)}</p>
                        <button
                            onClick={() => checkoutOrder(userId)}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
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