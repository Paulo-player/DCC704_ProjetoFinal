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

module.exports = router;