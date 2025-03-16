/**
 * @file server.js
 * @description Arquivo principal do backend. Ponto de entrada para o funcionamento da aplicação
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/database");

// Importação dos arquivos roteadores
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const movieRoutes = require("./routes/movieRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

//Aplicativo Express
const app = express();
const PORT = process.env.PORT || 5000;

// Conexão com o banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes); // Rotas de autenticação
app.use("/user", userRoutes); // Rotas do usuário

app.use("/api/movies", movieRoutes); // Rotas de filmes
app.use("/api/recommendations", recommendationRoutes); // Rotas de recomendações
app.use("/api/reviews", reviewRoutes); // Rotas de avaliações

// Iniciar o servidor
app.listen(PORT, () => console.log(`Servidor on-line na porta ${PORT}`));