//Rotas de filmes

const express = require("express");
const movieController = require("../controllers/movieController");
const router = express.Router();

// Rota para obter filmes populares
router.get("/popular", movieController.getPopularMovies);

module.exports = router;