import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist, addToWishlist as apiAdd, removeFromWishlist as apiRemove } from '../api/wishlist';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const data = await getWishlist();
      setItems(data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    await apiAdd(productId);
    await fetchWishlist();
  };

  const removeFromWishlist = async (itemId) => {
    await apiRemove(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const isInWishlist = (productId) => items.some((i) => i.product_id === productId || i.product?.id === productId);

  return (
    <WishlistContext.Provider value={{ items, loading, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
