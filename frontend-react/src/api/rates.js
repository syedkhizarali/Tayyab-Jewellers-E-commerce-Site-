import client from './client';

export const getLatestRates = async () => {
  const { data } = await client.get('/rates/latest');
  return data;
};

export const insertManualRate = async (rateData) => {
  const { data } = await client.post('/rates/manual', rateData);
  return data;
};
