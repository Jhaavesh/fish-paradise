import React, { createContext, useContext, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';
const CartContext = createContext();
const initialState = { items: [], isOpen: false };
function cartReducer(state, action) {
  switch (action.type) {
case 'ADD': {
  const ex = state.items.find(i => i._id === action.payload._id);

  const updatedItems = ex
    ? state.items.map(i =>
        i._id === action.payload._id ? { ...i, qty: i.qty + 1 } : i
      )
    : [...state.items, { ...action.payload, qty: 1 }];

  toast.success(`${action.payload.name} added to cart`);

  return {
    ...state,
    items: updatedItems
  };
}    case 'REMOVE': toast('Removed from cart', { icon: 'X' }); return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    case 'UPDATE_QTY': if (action.payload.qty < 1) return { ...state, items: state.items.filter(i => i._id !== action.payload.id) }; return { ...state, items: state.items.map(i => i._id === action.payload.id ? { ...i, qty: action.payload.qty } : i) };
    case 'CLEAR': return { ...state, items: [] };
    case 'TOGGLE_CART': return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART': return { ...state, isOpen: true };
    case 'CLOSE_CART': return { ...state, isOpen: false };
    default: return state;
  }
}
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const addToCart = useCallback(p => dispatch({ type: 'ADD', payload: p }), []);
  const removeFromCart = useCallback(id => dispatch({ type: 'REMOVE', payload: id }), []);
  const updateQty = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = state.items.reduce((s, i) => s + i.qty, 0);
  return <CartContext.Provider value={{ ...state, addToCart, removeFromCart, updateQty, clearCart, toggleCart, openCart, closeCart, total, itemCount }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
