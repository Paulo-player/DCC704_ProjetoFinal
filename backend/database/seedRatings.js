const mongoose = require("mongoose");
const User = require("../models/User");
const Movie = require("../models/Movie");
const Rating = require("../models/Rating");
const connectDB = require("./database");

// Função para gerar uma nota realista (distribuição normal centrada em 3)
const getRealisticRating = () => {
  const mean = 3; // Nota média
  const stdDev = 1.2; // Desvio padrão
  let rating;
  
  do {
    // Gera um número baseado na distribuição normal
    rating = Math.round(mean + stdDev * (Math.random() * 2 - 1));
  } while (rating < 0 || rating > 5); // Garante que a nota esteja entre 0 e 5

  return rating;
};

// Função para gerar um timestamp aleatório nos últimos 2 anos
const getRandomTimestamp = () => {
  const now = Date.now();
  const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000; // Dois anos em milissegundos
  return new Date(twoYearsAgo + Math.random() * (now - twoYearsAgo));
};

const populateRatings = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();
    console.log("Conectado ao MongoDB");

    // Buscar todos os usuários e filmes
    const users = await User.find();
    const movies = await Movie.find();

    if (users.length === 0 || movies.length === 0) {
      console.log("Nenhum usuário ou filme encontrado. População cancelada.");
      return;
    }

    // Criar um array de avaliações
    const ratings = [];

    for (const user of users) {
      // Selecionar 20% dos filmes aleatoriamente para cada usuário
      const numMoviesToRate = Math.ceil(movies.length * 0.2);
      const selectedMovies = movies
        .sort(() => 0.5 - Math.random()) // Embaralha os filmes
        .slice(0, numMoviesToRate); // Seleciona 20% dos filmes

      for (const movie of selectedMovies) {
        ratings.push({
          user: user._id,
          movie: movie._id,
          rating: getRealisticRating(),
          createdAt: getRandomTimestamp(),
        });
      }
    }

    // Inserir todas as avaliações no banco de dados
    await Rating.insertMany(ratings);
    console.log(`Avaliações adicionadas com sucesso! (${ratings.length} avaliações)`);

  } catch (error) {
    console.error("Erro ao popular avaliações:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Executar a função
populateRatings();