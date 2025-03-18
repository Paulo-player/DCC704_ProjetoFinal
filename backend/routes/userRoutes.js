//Rotas protegidas
const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');  // Usando o middleware importado

const router = express.Router();

//Página inicial do usuário logado
router.get('/home', verifyToken, (req, res) => {
    res.json({ message: `Bem-vindo à página home, ${req.user.username}!` });
});

module.exports = router;