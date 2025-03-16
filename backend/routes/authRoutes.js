/**
 * @file authRoutes.js
 * @description Arquivo roteador com as rotas de autenticação e autorização
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

const express = require("express");
const { register, login, refreshToken, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/token", refreshToken);
router.post("/logout", logout);

module.exports = router;