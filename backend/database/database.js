/**
 * @file database.js
 * @description Este arquivo contém a função que conecta o servidor ao banco de dados
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

const mongoose = require('mongoose');
require('dotenv').config({path:"../.env"})
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Conectado');
    } catch (error) {
        console.error('Erro de conexão com o MongoDB:', error);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;