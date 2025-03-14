// controllers/recommendationController.js
const User = require("../models/User");
const Rating = require("../models/Rating");
const Movie = require("../models/Movies");
const mongoose = require("mongoose");

const getSimilarUsers = async (userId) => {
  const userRatings = await Rating.find({ user: userId });
  const userMovies = userRatings.map(rating => rating.movie.toString());

  const allRatings = await Rating.find({ movie: { $in: userMovies } });
  const similarityScores = {};

  allRatings.forEach(({ user, movie, rating }) => {
    if (user.toString() !== userId.toString()) {
      if (!similarityScores[user]) similarityScores[user] = { total: 0, count: 0 };
      similarityScores[user].total += rating;
      similarityScores[user].count += 1;
    }
  });

  return Object.entries(similarityScores)
    .map(([user, data]) => ({ user, score: data.total / data.count }))
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.user);
};

const getRecommendedMovies = async (userId) => {
  const similarUsers = await getSimilarUsers(userId);
  const userRatings = await Rating.find({ user: userId });
  const userMovies = new Set(userRatings.map(rating => rating.movie.toString()));

  const recommendedMovies = new Map();

  for (const similarUser of similarUsers) {
    const similarUserRatings = await Rating.find({ user: similarUser }).populate("movie");
    
    similarUserRatings.forEach(({ movie, rating }) => {
      if (!userMovies.has(movie._id.toString())) {
        if (!recommendedMovies.has(movie._id)) {
          recommendedMovies.set(movie._id, { movie, total: 0, count: 0 });
        }
        const entry = recommendedMovies.get(movie._id);
        entry.total += rating;
        entry.count += 1;
      }
    });
  }

  return Array.from(recommendedMovies.values())
    .map(({ movie, total, count }) => ({ movie, averageRating: total / count }))
    .sort((a, b) => b.averageRating - a.averageRating);
};

module.exports = { getSimilarUsers, getRecommendedMovies };