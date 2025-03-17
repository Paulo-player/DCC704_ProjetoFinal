/**
 * @file userRoutes.js
 * @description Arquivo roteador com as rotas protegidas
 * @author Paulo Belmont <seuemail@example.com>
 * @version 1.0.0
 * @license MIT
 */

const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');  // Usando o middleware importado

const router = express.Router();

//Página inicial do usuário logado
router.get('/home', verifyToken, (req, res) => {
    res.json({ message: `Bem-vindo à página home, ${req.user.username}!` });
});

module.exports = router;