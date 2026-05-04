import client from './client';

export const getAddresses = async () => {
  const { data } = await client.get('/addresses/me');
  return data;
};

export const getAddress = async (id) => {
  const { data } = await client.get(`/addresses/me/${id}`);
  return data;
};

export const createAddress = async (addressData) => {
  const { data } = await client.post('/addresses/me', addressData);
  return data;
};

export const updateAddress = async (id, addressData) => {
  const { data } = await client.put(`/addresses/me/${id}`, addressData);
  return data;
};

export const deleteAddress = async (id) => {
  const { data } = await client.delete(`/addresses/me/${id}`);
  return data;
};
