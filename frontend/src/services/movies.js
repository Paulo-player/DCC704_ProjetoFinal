import axios from 'axios';

const API_URL = 'http://localhost:5000/api/movies';

export const getPopularMovies = async () => {
  const response = await axios.get(`${API_URL}/popular`);
  return response.data;
};

export const getMovieDetails = async (movieId) => {
  const response = await axios.get(`${API_URL}/${movieId}`);
  return response.data;
};