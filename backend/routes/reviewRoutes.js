const express = require("express");
const Rating = require("../models/Rating");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Rota para adicionar ou atualizar uma avaliação
router.post("/rate", authMiddleware, async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user.id;

    if (!movieId || rating === undefined) {
      return res.status(400).json({ message: "Filme e avaliação são obrigatórios." });
    }

    let userRating = await Rating.findOne({ user: userId, movie: movieId });

    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
    } else {
      userRating = new Rating({ user: userId, movie: movieId, rating });
      await userRating.save();
    }

    res.status(200).json({ message: "Avaliação salva com sucesso.", rating: userRating });
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar avaliação.", error: error.message });
  }
});

// Rota para obter avaliações de um filme
router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const ratings = await Rating.find({ movie: movieId }).populate("user", "username");

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar avaliações.", error: error.message });
  }
});

module.exports = router;