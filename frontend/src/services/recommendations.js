import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recommendations';

export const getRecommendations = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getFallbackRecommendations = async () => {
  const response = await axios.get(`${API_URL}/fallback`);
  return response.data;
};