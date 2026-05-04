import client from './client';

export const getWishlist = async () => {
  const { data } = await client.get('/wishlist/');
  return data;
};

export const addToWishlist = async (product_id) => {
  const { data } = await client.post('/wishlist/', { product_id });
  return data;
};

export const removeFromWishlist = async (itemId) => {
  const { data } = await client.delete(`/wishlist/${itemId}`);
  return data;
};
