import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

export const rateMovie = async (movieId, rating, token) => {
  const response = await axios.post(
    `${API_URL}/rate`,
    { movieId, rating },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getMovieRatings = async (movieId) => {
  const response = await axios.get(`${API_URL}/movie/${movieId}`);
  return response.data;
};