/**
 * @file recommendationController.js
 * @description Este arquivo contém as funções relacionadas ao sistema de recomendação do site
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");
const mongoose = require("mongoose");

const { TfidfVectorizer } = require("node-nlp");
const { cosineSimilarity } = require("ml-distance");

// Caminho para o arquivo de log
const logFilePath = path.join(__dirname, "log.txt");

// Função para registrar mensagens no arquivo de log
function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage =
    typeof message === "object"
      ? `[${timestamp}] ${JSON.stringify(message, null, 2)}`
      : `[${timestamp}] ${message}`;
  fs.appendFileSync(logFilePath, formattedMessage + "\n", "utf8");
}

// Adicionando índices no esquema Rating (caso não tenham sido criados)
Rating.schema.index({ user: 1 });
Rating.schema.index({ movie: 1 });

const NUM_RECENT_MOVIES = 5;
const MIN_RATING = 4; // Somente filmes com nota ≥ 4 são considerados

// Obtém usuários similares com base nos filmes avaliados
const getSimilarUsers = async (userId) => {
  // Obtém as avaliações do usuário e os filmes que ele avaliou
  const userRatings = await Rating.find({ user: userId }).select("movie");
  const userMovies = userRatings.map((rating) => rating.movie.toString());

  // Busca todas as avaliações desses filmes por outros usuários
  const allRatings = await Rating.find({ movie: { $in: userMovies } });

  const similarityScores = {};
  allRatings.forEach(({ user, movie, rating }) => {
    if (user.toString() !== userId.toString()) {
      if (!similarityScores[user]) similarityScores[user] = { total: 0, count: 0 };
      similarityScores[user].total += rating;
      similarityScores[user].count += 1;
    }
  });

  log("Similaridade dos usuários: " + JSON.stringify(similarityScores, null, 2));
  return Object.entries(similarityScores)
    .map(([user, data]) => ({ user, score: data.total / data.count }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.user);
};

// Recomenda filmes com base em usuários similares
const getRecommendedMovies = async (userId) => {
  try {
    log("Buscando recomendações para o usuário: " + userId);

    // Obter usuários semelhantes
    const similarUsers = await getSimilarUsers(userId);
    log("Usuários semelhantes encontrados: " + JSON.stringify(similarUsers));

    if (!similarUsers.length) {
      log("Nenhum usuário semelhante encontrado.");
      return [];
    }

    // Log: Para cada usuário similar, exibir os filmes que ele avaliou
    for (const similarUser of similarUsers) {
      const ratedMovies = await Rating.find({ user: similarUser }).select("movie rating");
      log(`Usuário similar ${similarUser} avaliou: ` + JSON.stringify(ratedMovies, null, 2));
    }

    // Obter os filmes avaliados pelo usuário
    const userRatings = await Rating.find({ user: userId }).select("movie");
    const userMovies = new Set(userRatings.map((rating) => rating.movie.toString()));
    log("Filmes avaliados pelo usuário: " + JSON.stringify(Array.from(userMovies)));

    log("Filtrando filmes que não estão entre os avaliados pelo usuário...");

    // Buscar os filmes recomendados com base nos usuários semelhantes
    const recommendedMovies = await Rating.aggregate([
      { $match: { user: { $in: similarUsers }, movie: { $nin: Array.from(userMovies) } } },
      {
        $group: {
          _id: "$movie",
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { averageRating: -1 } },
      { $limit: 10 },
    ]);
    log("Filmes recomendados após agregação: " + JSON.stringify(recommendedMovies, null, 2));

    if (!recommendedMovies.length) {
      log("Nenhum filme foi recomendado.");
      return [];
    }

    // Extrair os IDs dos filmes recomendados
    const movieIds = recommendedMovies.map((movie) => movie._id);
    log("IDs dos filmes recomendados: " + JSON.stringify(movieIds));

    // Buscar os filmes no banco de dados
    const movies = await Movie.find({ _id: { $in: movieIds } });
    log("Filmes encontrados no banco de dados: " + JSON.stringify(movies, null, 2));

    if (!movies.length) {
      log("Nenhum filme encontrado no banco de dados.");
      return [];
    }

    // Retornar os filmes recomendados com suas notas médias
    const finalRecommendations = movies.map((movie) => ({
      movie,
      averageRating: recommendedMovies.find((r) => r._id.toString() === movie._id.toString()).averageRating,
    }));
    log("Filmes finais recomendados: " + JSON.stringify(finalRecommendations, null, 2));

    return finalRecommendations;
  } catch (error) {
    log("Erro ao obter filmes recomendados: " + error);
    return [];
  }
};

// Obtém os últimos filmes bem avaliados pelo usuário
const getRecentPositiveMovies = async (userId) => {
  return await Rating.find({ user: userId, rating: { $gte: MIN_RATING } })
    .sort({ createdAt: -1 })
    .limit(NUM_RECENT_MOVIES)
    .populate("movie");
};

// Extrai características dos filmes para o TF-IDF
const extractFeatures = (movies) => {
  return movies.map((movie) => {
    return [movie.title, movie.overview, (movie.genre_ids || []).join(" ")].join(" ");
  });
};

// Recomenda filmes baseados nos últimos filmes bem avaliados (TF-IDF)
const getContentBasedRecommendations = async (userId) => {
  const recentMovies = await getRecentPositiveMovies(userId);
  if (recentMovies.length === 0) return [];

  const allMovies = await Movie.find();
  const tfidf = new TfidfVectorizer();
  const corpus = extractFeatures(allMovies);
  tfidf.fitTransform(corpus);

  const positiveVectors = recentMovies.map((movie) => tfidf.transform(extractFeatures([movie.movie])));
  const userProfileVector = positiveVectors.reduce(
    (acc, vec) => acc.map((val, idx) => val + vec[idx]),
    new Array(positiveVectors[0].length).fill(0)
  );

  const recommendations = allMovies
    .filter((movie) => !recentMovies.some((rm) => rm.movie._id.equals(movie._id)))
    .map((movie) => {
      const movieVector = tfidf.transform(extractFeatures([movie]));
      return {
        movie,
        similarity: cosineSimilarity(userProfileVector, movieVector),
      };
    });

  return recommendations.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
};

module.exports = { getSimilarUsers, getRecommendedMovies, getContentBasedRecommendations };