require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes'); // Antes era protectedRoutes

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Modificado para usar '/auth' ao invés de '/api/auth'
app.use("/auth", authRoutes);   // Agora as rotas de autenticação serão acessadas com /auth
app.use("/user", userRoutes);   // As rotas de usuário agora são acessadas com /user

app.listen(PORT, () => console.log(`Server on-line na porta ${PORT}`));
