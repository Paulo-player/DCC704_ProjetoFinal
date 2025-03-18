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

  getFallbackRecommendations: async () => {
    return {
      'Popular Movies': await Movie.find().sort({ popularity: -1 }).limit(10),
      'Top Rated': await Movie.find().sort({ vote_average: -1 }).limit(10),
      'Latest Releases': await Movie.find().sort({ release_date: -1 }).limit(10),
    };
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