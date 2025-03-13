const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });

        req.user = user;
        next();
    });
};

// Rota protegida /home
router.get('/home', verifyToken, (req, res) => {
    res.json({ message: `Bem-vindo à página home, ${req.user.username}!` });
});

module.exports = router;
