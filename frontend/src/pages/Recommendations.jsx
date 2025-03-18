import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import "../styles/recommendations.css";

const Recommendations = () => {
  const [movies, setMovies] = useState({
    similar: [],
    director: [],
    genre: [],
    topRated: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchMovies();
    }
  }, [navigate]);

  const fetchMovies = async () => {
    try {
      const responses = await Promise.all([
        fetch("/api/recommendations/similar"),
        fetch("/api/recommendations/director"),
        fetch("/api/recommendations/genre"),
        fetch("/api/recommendations/top-rated"),
      ]);

      const data = await Promise.all(responses.map((res) => res.json()));
      setMovies({
        similar: data[0],
        director: data[1],
        genre: data[2],
        topRated: data[3],
      });
    } catch (error) {
      console.error("Erro ao buscar recomendações", error);
    }
  };

  return (
    <div className="recommendations-container">
      <Navbar />
      <h1>Recomendações</h1>
      <div className="recommendation-section">
        <h2>Filmes Similares ao Último Bem Avaliado</h2>
        <div className="movie-list">
          {movies.similar.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
      <div className="recommendation-section">
        <h2>Filmes do Mesmo Diretor</h2>
        <div className="movie-list">
          {movies.director.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
      <div className="recommendation-section">
        <h2>Filmes do Mesmo Gênero</h2>
        <div className="movie-list">
          {movies.genre.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
      <div className="recommendation-section">
        <h2>Bem Avaliados no Geral</h2>
        <div className="movie-list">
          {movies.topRated.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
