// src/components/movies/MovieCard.jsx
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/movie/${movie.tmdb_id}`}>
        <img 
          src={movie.posterUrl} 
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
        <RatingStars 
          movieId={movie._id} 
          currentRating={movie.userRating} 
        />
      </div>
    </div>
  );
};

export default MovieCard