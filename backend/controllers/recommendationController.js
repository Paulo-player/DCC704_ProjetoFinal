// Este arquivo contém as funções relacionadas ao sistema de recomendação do site

const { Movie, Rating } = require('../models/Schemas');
const tfidfService = require('../services/tfidfService');

const RecommendationController = {
  getContentRecommendations: async (userId) => {
    const userRatings = await Rating.find({ user: userId })
      .sort({ rating: -1 })
      .limit(5)
      .populate('movie');

    if (userRatings.length === 0) {
      return RecommendationController.getFallbackRecommendations();
    }

    const recommendations = await Promise.all(
      userRatings.map(async (rating) => ({
        source: rating.movie.title,
        movies: await tfidfService.getSimilarMovies(rating.movie._id, 5),
      }))
    );

    return RecommendationController.formatRecommendations(recommendations);
  },
  
  getLastRatedMovie: async (userId) => {
    const lastRated = await Rating.find({ user: userId })
      .sort({ timestamp: -1 }) // Pega a avaliação mais recente
      .limit(1)
      .populate('movie');
  
    if (!lastRated.length) {
      return null; // Nenhum filme avaliado
    }
  
    return lastRated[0].movie;
  },
  
  getFallbackRecommendations: async () => {
    return {
      'Popular Movies': await Movie.find().sort({ popularity: -1 }).limit(10),
      'Top Rated': await Movie.find().sort({ vote_average: -1 }).limit(10),
      'Latest Releases': await Movie.find().sort({ release_date: -1 }).limit(10),
    };
  },
  getRecommendationsByDirector: async (userId, limit = 10) => {
    // Obtém o último filme bem avaliado
    const lastRatedMovie = await RecommendationController.getLastRatedMovie(userId);
    if (!lastRatedMovie) return [];
  
    // Obtém diretores do último filme
    const directors = lastRatedMovie.directors;
    if (!directors || directors.length === 0) return [];
  
    // Busca outros filmes do mesmo diretor, excluindo o último filme avaliado
    const recommendedMovies = await Movie.find({
      directors: { $in: directors },
      _id: { $ne: lastRatedMovie._id },
    })
      .sort({ popularity: -1 })
      .limit(limit);
  
    return recommendedMovies;
  },
  getRecommendationsByGenre: async (userId, limit = 10) => {
    // Obtém o último filme bem avaliado
    const lastRatedMovie = await RecommendationController.getLastRatedMovie(userId);
    if (!lastRatedMovie) return [];
  
    // Obtém gêneros do último filme
    const genres = lastRatedMovie.genres;
    if (!genres || genres.length === 0) return [];
  
    // Busca outros filmes do mesmo gênero, excluindo o último filme avaliado
    const recommendedMovies = await Movie.find({
      genres: { $in: genres },
      _id: { $ne: lastRatedMovie._id },
    })
      .sort({ popularity: -1 })
      .limit(limit);
  
    return recommendedMovies;
  },  
  getFormattedRecommendations: async (userId) => {
    const lastRatedMovie = await RecommendationController.getLastRatedMovie(userId);
    
    const recommendations = {
      "Based on your last highly rated movie": lastRatedMovie
        ? await tfidfService.getSimilarMovies(lastRatedMovie._id, 5)
        : [],
      
      "Movies from the same director": lastRatedMovie
        ? await RecommendationController.getRecommendationsByDirector(userId, 5)
        : [],
  
      "Movies from the same genre": lastRatedMovie
        ? await RecommendationController.getRecommendationsByGenre(userId, 5)
        : [],
  
      "General content-based recommendations": await RecommendationController.getContentRecommendations(userId)
    };
  
    return recommendations;
  },  
  formatRecommendations: (rawRecommendations) => {
    const merged = rawRecommendations.reduce((acc, { source, movies }) => {
      acc[`Because you liked "${source}"`] = movies.map((m) => m.movie);
      return acc;
    }, {});

    // Remove duplicates across categories
    const seen = new Set();
    Object.values(merged).forEach((movies) => {
      movies.forEach((movie) => {
        if (seen.has(movie._id.toString())) {
          movie._duplicate = true;
        }
        seen.add(movie._id.toString());
      });
    });

    return Object.entries(merged).reduce((acc, [key, value]) => {
      acc[key] = value.filter((m) => !m._duplicate).slice(0, 5);
      return acc;
    }, {});
  },
};

module.exports = RecommendationController;