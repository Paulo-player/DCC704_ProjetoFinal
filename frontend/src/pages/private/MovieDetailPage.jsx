import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../../services/movies';
import RatingStars from '../../components/movies/RatingStars';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <div className="mb-4">
            <RatingStars movieId={movie._id} initialRating={movie.userRating} />
          </div>
          <p className="text-gray-600 mb-4">{movie.overview}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Release Date</h3>
              <p>{new Date(movie.release_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Rating</h3>
              <p>{movie.vote_average}/10 ({movie.vote_count} votes)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage