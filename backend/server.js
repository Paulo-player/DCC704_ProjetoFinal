require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/database");
const authRoutes = require("./routes/authRoutes");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Server on-line na porta ${PORT}`));
