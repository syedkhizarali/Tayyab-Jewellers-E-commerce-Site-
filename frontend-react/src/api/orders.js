import client from './client';

export const getMyOrders = async () => {
  const { data } = await client.get('/orders/me');
  return data;
};

export const createOrder = async (orderData) => {
  const { data } = await client.post('/orders/', orderData);
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await client.put(`/orders/${orderId}/status`, { status });
  return data;
};

export const getAllOrders = async () => {
  const { data } = await client.get('/orders/');
  return data;
};
