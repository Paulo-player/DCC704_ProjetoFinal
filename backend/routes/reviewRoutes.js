/**
 * @file reviewRoutes.js
 * @description Arquivo roteador com as rotas de avaliação
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

const express = require("express");
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Rota para atribuir avaliação de filme
router.post("/rate", authMiddleware, async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user.id;

    console.log("Recebido movieId:", movieId);
    console.log("Recebido rating:", rating);
    console.log("ID do usuário:", userId);

    // Verificar se o filme existe
    const movie = await Movie.findOne({ id: movieId });
    if (!movie) {
      console.log("Filme não encontrado");
      return res.status(404).json({ message: "Filme não encontrado." });
    }

    // Verificar se a avaliação está no intervalo permitido (0 a 5)
    if (rating < 0 || rating > 5) {
      console.log("Avaliação inválida");
      return res.status(400).json({ message: "Avaliação deve ser um valor entre 0 e 5." });
    }

    // Verificar se o usuário já avaliou este filme
    let userRating = await Rating.findOne({ user: userId, movie: movie._id });
    if (userRating) {
      // Se já avaliou, atualize a avaliação
      console.log("Atualizando avaliação existente");
      userRating.rating = rating;
      await userRating.save();
    } else {
      // Se não avaliou, crie uma nova avaliação
      console.log("Criando nova avaliação");
      userRating = new Rating({
        user: userId,
        movie: movie._id,
        rating,
      });
      await userRating.save();
    }

    res.status(200).json({ message: "Avaliação salva com sucesso.", rating: userRating });
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    res.status(500).json({ message: "Erro ao salvar avaliação.", error: error.message });
  }
});

module.exports = router;