import client from './client';

export const getCart = async () => {
  const { data } = await client.get('/api/cart/');
  return data;
};

export const addToCart = async ({ product_id, quantity = 1 }) => {
  const { data } = await client.post('/api/cart/', { product_id, quantity });
  return data;
};

export const updateCartItem = async (itemId, quantity) => {
  const { data } = await client.put(`/api/cart/${itemId}`, { quantity });
  return data;
};

export const removeFromCart = async (itemId) => {
  const { data } = await client.delete(`/api/cart/${itemId}`);
  return data;
};
