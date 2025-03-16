/**
 * @file authMiddleware.js
 * @description Esse arquivo contém o middleware verifyToken, utilizado ao acessar qualquer rota protegida que requira token
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido. Redirecionar para login.' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido. Redirecionar para login.' });
        }

        req.user = user;
        next();
    });
};

module.exports = verifyToken;
