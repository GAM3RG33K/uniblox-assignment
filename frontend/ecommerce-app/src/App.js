import React, { useState, useEffect } from 'react';
import { fetchProducts, addToCard, fetchCart } from './api';
import { FaShoppingCart } from 'react-icons/fa';
import { userId } from './index';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});

  const fetchCartItems = async (userId) => {
    const response = await fetchCart(userId);
    if (!response) {
      return;
    }

    return response;
  };
  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    getProducts();
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      const cart = await fetchCartItems(userId);
      if (cart) {
        const appCart = {};


        cart.forEach((product) => {
          if (appCart[product.id]) return;

          const productCount = cart.filter((p) => product.id === p.id).length;
          appCart[product.id] = {
            ...product,
            count: productCount,
          };

        });

        console.log(`appCart: ${JSON.stringify(appCart, 4)}`)
        setCart(appCart);
      }
    };
    updateCart();
  }, []);

  const addProductToCart = async (product) => {

    const response = await addToCard(userId, product.id);
    if (!response) {
      return;
    }

    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: {
        ...product,
        count: (prevCart[product.id]?.count || 0) + 1,
      },
    }));
  };

  const getTotalCartItems = () => {
    var cartItemsCount = 0;
    Object.values(cart).forEach((product) => {
      cartItemsCount += (product.count || 0);
    });
    return cartItemsCount;
  };



  const getTotalProductCount = (productId) => {
    return (cart[productId] || {}).count;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="relative">
          <FaShoppingCart className="text-2xl" />
          {getTotalCartItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {getTotalCartItems()}
            </span>
          )}
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={product.thumbnail} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={() => addProductToCart(product)}
              >
                Add to Cart {getTotalProductCount(product.id) > 0 ? `(${getTotalProductCount(product.id)})` : ''}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;