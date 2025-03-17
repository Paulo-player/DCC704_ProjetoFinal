//Função de busca de filmes populares

const {Movie} = require("../models/Schemas"); // Modelo de filmes
const axios = require("axios"); // Para fazer requisições à API TMDB

// Obtém filmes populares
exports.getPopularMovies = async (req, res) => {
  try {
    // 
    const popularMovies = await Movie.find()
      .sort({ popularity: -1 }) // Ordena pela popularidade
      .limit(10); // Limita a 10 filmes

    // Mapeia para associar as imagens
    const prefixUrl = "https://image.tmdb.org/t/p/w500";
    const movieData = popularMovies.map((movie) => ({
      title: movie.title,
      posterUrl: `${prefixUrl}${movie.poster_path}`,
      backdropUrl: `${prefixUrl}${movie.backdrop_path}`,
    }));

    res.json(movieData); // Envia os dados para o frontend
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar filmes populares.");
  }
};