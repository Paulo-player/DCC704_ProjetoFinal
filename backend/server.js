require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/database");

//Importação das rotas em routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require("./routes/movieRoutes");

const PORT = process.env.PORT || 5000;
const app = express();

//MIDDLEWARES
app.use(cors());
app.use(express.json());

connectDB();

//ROTAS
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api/movies", movieRoutes);

app.listen(PORT, () => console.log(`Server on-line na porta ${PORT}`));
