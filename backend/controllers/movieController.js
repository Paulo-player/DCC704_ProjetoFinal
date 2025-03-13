// controllers/movieController.js

const Movie = require("../models/Movies"); // Modelo de filmes
const axios = require("axios"); // Para fazer requisições à API TMDB

// Função para buscar filmes populares
exports.getPopularMovies = async (req, res) => {
  try {
    // Busca os 10 filmes com maior popularidade
    const popularMovies = await Movie.find()
      .sort({ popularity: -1 }) // Ordena pela popularidade
      .limit(10); // Limita a 10 filmes

    // Mapeia para associar as imagens
    const movieData = popularMovies.map((movie) => ({
      title: movie.title,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      backdropUrl: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
    }));

    res.json(movieData); // Envia os dados para o frontend
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar filmes populares.");
  }
};
