import client from './client';

export const updateStock = async (productId, quantity) => {
  const { data } = await client.put(`/inventory/products/${productId}/stock`, { quantity });
  return data;
};

export const getLowStockItems = async (threshold = 5) => {
  const { data } = await client.get('/inventory/low-stock', { params: { threshold } });
  return data;
};
