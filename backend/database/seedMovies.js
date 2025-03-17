//Utilitário para extrair filmes do TMDB para o Database

require('dotenv').config({ path: "../.env" });
const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require("../models/Movie");
const connectDB = require("./database");

// Conexão com o mongoDB
connectDB()

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