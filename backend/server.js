require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/database");

// Importação das rotas em routes
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao banco de dados
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
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));