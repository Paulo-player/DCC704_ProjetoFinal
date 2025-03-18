// Rotas de avaliação
const express = require("express");
const { Rating, Movie } = require("../models/Schemas");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Rota para atribuir avaliação de filme
router.post("/rate", authMiddleware, async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user.id;

    // Verificar se o filme existe
    const movie = await Movie.findOne({ tmdb_id: movieId });
    if (!movie) {
      return res.status(404).json({ message: "Filme não encontrado." });
    }

    // Criar ou atualizar a avaliação usando findOneAndUpdate
    const userRating = await Rating.findOneAndUpdate(
      { user: userId, movie: movie._id },
      { rating },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Avaliação salva com sucesso.", rating: userRating });
  } catch (error) {
    console.error(`Erro ao processar avaliação para movieId ${req.body.movieId}, userId ${req.user.id}:`, error);
    res.status(500).json({ message: "Erro ao salvar avaliação.", error: error.message });
  }
});

module.exports = router;
