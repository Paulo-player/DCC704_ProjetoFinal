/**
 * @file Rating.js
 * @description Esquema de ratings
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    rating: { type: Number, required: true, min: 0, max: 5 }, // Avaliação de 0 a 5
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);