// routes/recommendationRoutes.js
const express = require("express");
const { getRecommendedMovies } = require("../controllers/recommendationController");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");

// Rota para obter recomendações de filmes para um usuário
router.get("/movies", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendedMovies = await getRecommendedMovies(userId);
    res.json(recommendedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao obter recomendações." });
  }
});

module.exports = router;
