/**
 * @file seedMovies.js
 * @description Este arquivo popula o banco de dados com os 10.000 filmes mais populares no TMDB
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

require('dotenv').config({ path: "../.env" });
const axios = require('axios');
const mongoose = require('mongoose');

// Conexão com o mongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema de filmes
const movieSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: String,
    overview: String,
    release_date: String,
    popularity: Number,
    vote_average: Number,
    vote_count: Number,
    poster_path: String,
    backdrop_path: String,
    genre_ids: [String]
});

const Movie = mongoose.model('Movie', movieSchema);

// API da TMDB
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/movie/popular';
const GENRE_LIST_URL = 'https://api.themoviedb.org/3/genre/movie/list';
const MAX_PAGES = 500; // 20 filmes por página * 500 = 10.000 filmes

// TRADUÇÃO DOS CÓDIGOS DE GÊNERO PARA O GÊNERO EQUIVALENTE.
let genreTranslations = {};

// Obter e guardar as equivalências em um map
const fetchGenres = async () => {
    try {
        const response = await axios.get(`${GENRE_LIST_URL}?api_key=${API_KEY}&language=en-US`);
        const genres = response.data.genres;
        genreTranslations = genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;  // Mapeando IDs para nomes de gênero
            return acc;
        }, {});
        console.log('Nomes dos gêneros obtidos com sucesso');
    } catch (err) {
        console.error('Erro ao obter o nome dos gêneros:', err.response?.data || err.message);
    }
};

// Função para mapear os 
const translateGenres = (genreIds) => {
    return genreIds.map(id => genreTranslations[id] || `Unknown (${id})`);
};

// Função para obter e guardar os filmes na database
const fetchAndStoreMovies = async () => {
    console.log('Obtendo filmes do TMDB...');
    for (let page = 1; page <= MAX_PAGES; page++) {
        try {
            const response = await axios.get(`${BASE_URL}?api_key=${API_KEY}&language=en-US&page=${page}`);
            const movies = response.data.results;

            if (!movies || movies.length === 0) break; //Parar no caso de nenhum filme retornado

            // Traduzindo os ids de gênero de cada filme
            const moviesWithTranslatedGenres = movies.map(movie => {
                const translatedGenres = translateGenres(movie.genre_ids);
                movie.genre_ids = translatedGenres; // Aplicar os gêneros traduzidos
                return movie;
            });

            // Inserindo filmes no mongoDB (IGNORANDO DUPLICATAS)
            await Movie.insertMany(moviesWithTranslatedGenres, { ordered: false }).catch(err => {
                if (err.code !== 11000) console.error('Error inserting movies:', err);
            });

            console.log(`Stored page ${page}/${MAX_PAGES}`);
        } catch (err) {
            console.error(`Error fetching page ${page}:`, err.response?.data || err.message);
            break;
        }
    }
    console.log('Movie extraction completed.');
    mongoose.connection.close();
};

// Obtendo gêneros, e depois, filmes
const run = async () => {
    await fetchGenres();  // Obtendo o nome dos gêneros primeiro
    fetchAndStoreMovies();  // Obtendo e guardando os filmes
};

// Execução do script
run();
