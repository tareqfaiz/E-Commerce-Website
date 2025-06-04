import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import API from '../services/api';

const CartContext = createContext();

const initialState = {
  cartItems: [],
};

function cartReducer(state, action) {
  let updatedCartItems;
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return {
        ...state,
        cartItems: action.payload,
      };
    case 'ADD_TO_CART':
      const { product, selectedSize } = action.payload;
      const existingItem = state.cartItems.find(
        item => item.id === product.id && item.size === selectedSize
      );
      if (existingItem) {
        updatedCartItems = state.cartItems.map(item =>
          item.id === product.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCartItems = [...state.cartItems, { ...product, size: selectedSize, quantity: 1 }];
      }
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return {
        ...state,
        cartItems: updatedCartItems,
      };
    case 'REMOVE_FROM_CART':
      const { id, size } = action.payload;
      updatedCartItems = state.cartItems.filter(
        item => !(item.id === id && item.size === size)
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return {
        ...state,
        cartItems: updatedCartItems,
      };
    case 'INCREMENT_QUANTITY':
      updatedCartItems = state.cartItems.map(item =>
        item.id === action.payload.id && item.size === action.payload.size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return {
        ...state,
        cartItems: updatedCartItems,
      };
    case 'DECREMENT_QUANTITY':
      updatedCartItems = state.cartItems
        .map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return {
        ...state,
        cartItems: updatedCartItems,
      };
    case 'CLEAR_CART':
      localStorage.removeItem('cartItems');
      return {
        cartItems: [],
      };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = async () => {
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      if (storedCartItems.length === 0) {
        dispatch({ type: 'SET_CART_ITEMS', payload: [] });
        setLoading(false);
        return;
      }
      try {
        const detailedItems = await Promise.all(
          storedCartItems.map(async (item) => {
            const response = await API.get(`/products/${item.id}`);
            return {
              ...response.data,
              quantity: item.quantity,
              size: item.size,
            };
          })
        );
        dispatch({ type: 'SET_CART_ITEMS', payload: detailedItems });
      } catch (error) {
        console.error('Failed to load cart items with details:', error);
        dispatch({ type: 'SET_CART_ITEMS', payload: storedCartItems });
      }
      setLoading(false);
    };
    loadCartItems();
  }, []);

  const addToCart = (product, selectedSize) => {
    if (!selectedSize) {
      console.error('Size must be selected before adding to cart');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { product, selectedSize } });
  };

  const removeFromCart = (id, size) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size } });
  };

  const incrementQuantity = (id, size) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: { id, size } });
  };

  const decrementQuantity = (id, size) => {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: { id, size } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
