const MovieCard = ({ movie, onClick }) => {
    return (
      <div className="movie-card" onClick={() => onClick(movie)}>
        <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
        <h3 className="movie-title">{movie.title}</h3>
      </div>
    );
  };
  
  export default MovieCard;
  