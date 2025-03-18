//Rotas de recomendação


const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const RecommendationController = require('../controllers/recommendationController');

// @route   GET /api/recommendations
// @desc    Get personalized recommendations
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const recommendations = await RecommendationController
      .getContentRecommendations(req.user.id);
      
    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/recommendations/fallback
// @desc    Get non-personalized recommendations
// @access  Public
router.get('/fallback', async (req, res) => {
  try {
    const recommendations = await RecommendationController
      .getFallbackRecommendations();
      
    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/recommendations/last-rated
// @desc    Get similar movies to the one last rated
// @access  Public
router.get('/last-rated', verifyToken, async (req, res) => {
  try {
    const lastMovie = await RecommendationController.getLastRatedMovie(req.user.id);

    if (!lastMovie) {
      return res.status(404).json({ msg: 'Nenhuma avaliação encontrada' });
    }

    res.json({ lastRatedMovie: lastMovie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

router.get('/by-director', verifyToken, async (req, res) => {
  try {
    const recommendations = await RecommendationController.getRecommendationsByDirector(req.user.id);

    if (!recommendations.length) {
      return res.status(404).json({ msg: 'Nenhuma recomendação encontrada com base no diretor' });
    }

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

router.get('/by-genre', verifyToken, async (req, res) => {
  try {
    const recommendations = await RecommendationController.getRecommendationsByGenre(req.user.id);

    if (!recommendations.length) {
      return res.status(404).json({ msg: 'Nenhuma recomendação encontrada com base no gênero' });
    }

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

router.get('/all', verifyToken, async (req, res) => {
  try {
    const recommendations = await RecommendationController.getFormattedRecommendations(req.user.id);
    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao obter recomendações' });
  }
});


module.exports = router;

