// Função de busca de filmes populares
const { Movie } = require("../models/Schemas"); // Modelo de filmes

// Obtém filmes populares
exports.getPopularMovies = async (req, res) => {
  try {
    const popularMovies = await Movie.find({ popularity: { $gt: 0 } }) // Garante que só retorna filmes com popularidade definida
      .sort({ popularity: -1 })
      .limit(10);

    if (!popularMovies.length) {
      return res
        .status(404)
        .json({ message: "Nenhum filme popular encontrado." });
    }

    // Mapeia para associar as imagens, garantindo que os campos existem
    const prefixUrl = "https://image.tmdb.org/t/p/w500";
    const defaultPoster = "https://via.placeholder.com/500x750?text=Sem+Imagem";

    const movieData = popularMovies.map((movie) => ({
      tmdb_id: movie.tmdb_id,
      title: movie.title,
      posterUrl: movie.poster_path
        ? `${prefixUrl}${movie.poster_path}`
        : defaultPoster,
      backdropUrl: movie.backdrop_path
        ? `${prefixUrl}${movie.backdrop_path}`
        : null,
    }));

    res.json(movieData);
  } catch (error) {
    console.error("Erro ao buscar filmes populares:", error);
    res.status(500).json({ message: "Erro ao buscar filmes populares." });
  }
};
