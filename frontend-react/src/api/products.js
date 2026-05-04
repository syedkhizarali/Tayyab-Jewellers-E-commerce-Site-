import client from './client';

export const getProducts = async () => {
  const { data } = await client.get('/products/');
  return data;
};

export const searchProducts = async (filters = {}) => {
  const { data } = await client.get('/products/search', { params: filters });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await client.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await client.post('/products/', productData);
  return data;
};

export const uploadProductImage = async (productId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await client.post(`/products/upload-image/${productId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await client.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await client.delete(`/products/${id}`);
  return data;
};
