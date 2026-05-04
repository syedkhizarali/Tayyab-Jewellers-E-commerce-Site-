import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as apiAdd, removeFromCart as apiRemove, updateCartItem as apiUpdate } from '../api/cart';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const data = await getCart();
      setItems(data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    await apiAdd({ product_id: productId, quantity });
    await fetchCart();
  };

  const removeFromCart = async (itemId) => {
    await apiRemove(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) { await removeFromCart(itemId); return; }
    await apiUpdate(itemId, quantity);
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
  };

  const cartCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const cartTotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * (i.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ items, loading, cartCount, cartTotal, isOpen, setIsOpen, addToCart, removeFromCart, updateQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
