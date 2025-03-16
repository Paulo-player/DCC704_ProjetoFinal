/**
 * @file movieRoutes.js
 * @description Arquivo roteador com as rotas de filmes
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

const express = require("express");
const movieController = require("../controllers/movieController");
const router = express.Router();

// Rota para obter filmes populares
router.get("/popular", movieController.getPopularMovies);

module.exports = router;