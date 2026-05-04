import client from './client';

export const getProfile = async () => {
  const { data } = await client.get('/profile/me');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await client.put('/profile/me', profileData);
  return data;
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await client.post('/profile/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
