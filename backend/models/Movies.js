/**
 * @file Movies.js
 * @description Esquema de filme
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  release_date: {
    type: Date,
    required: true,
  },
  popularity: {
    type: Number,
    required: true,
  },
  vote_average: {
    type: Number,
    required: true,
  },
  vote_count: {
    type: Number,
    required: true,
  },
  poster_path: {
    type: String,
    required: true,
  },
  backdrop_path: {
    type: String,
    required: true,
  },
  genre_ids: [{
    type: String,
  }],
});

module.exports = mongoose.model("Movie", movieSchema);