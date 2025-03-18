//Utilitário para adicionar 100 usuários ao database

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {User} = require("../models/Schemas");
const connectDB = require("./database");

async function populateUsers() {
  try {
    await connectDB(); // Usa a função de conexão existente
    console.log("Conectado ao MongoDB");

    const users = [];
    for (let i = 1; i <= 50; i++) {
      const username = `Dummy${i}`;
      const password = `Dummy${i}`;
      const hashedPassword = await bcrypt.hash(password, 10);
      users.push({ username, password: hashedPassword });
    }

    await User.insertMany(users);
    console.log("Usuários criados com sucesso!");
  } catch (error) {
    console.error("Erro ao popular usuários:", error);
  } finally {
    mongoose.connection.close();
  }
}

populateUsers();