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

//Rotas
app.use("/api/auth", authRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => console.log(`Server on-line na porta ${PORT}`));
