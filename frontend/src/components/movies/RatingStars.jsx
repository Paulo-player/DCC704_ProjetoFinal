import { useState, useEffect } from 'react';
import { rateMovie } from '../../services/reviews';
import { useAuth } from '../../context/AuthContext';

const RatingStars = ({ movieId, initialRating }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(0);
  const { getAccessToken } = useAuth();

  const handleRating = async (newRating) => {
    try {
      const token = await getAccessToken();
      await rateMovie(movieId, newRating, token);
      setRating(newRating);
    } catch (error) {
      console.error('Rating failed:', error);
    }
  };

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={ratingValue}
            onClick={() => handleRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            className={`text-2xl ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars