import React from "react";
import "../styles/global.css";

function RecommendationSection({ title, movies }) {
  return (
    <div className="recommendations-section">
      <h3 className="recommendations-title">{title}</h3>
      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
              <p className="movie-title">{movie.title}</p>
            </div>
          ))
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </div>
  );
}

export default RecommendationSection;
