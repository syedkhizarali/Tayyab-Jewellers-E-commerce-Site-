import client from './client';

export const createPayment = async (paymentData) => {
  const { data } = await client.post('/payments/', paymentData);
  return data;
};

export const getPayment = async (id) => {
  const { data } = await client.get(`/payments/${id}`);
  return data;
};

export const getOrderPayments = async (orderId) => {
  const { data } = await client.get(`/payments/order/${orderId}`);
  return data;
};

export const verifyBankTransfer = async (paymentId) => {
  const { data } = await client.post(`/payments/verify-bank-transfer/${paymentId}`);
  return data;
};
