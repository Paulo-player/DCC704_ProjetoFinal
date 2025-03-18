import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import MovieCarousel from './MovieCarousel';

const RecommendationSection = () => {
  const [recommendations, setRecommendations] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const endpoint = user ? '/api/recommendations' : '/api/recommendations/fallback';
        const response = await axios.get(endpoint);
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [user]);

  return (
    <div className="recommendations-container">
      {Object.entries(recommendations).map(([title, movies]) => (
        <div key={title} className="recommendation-category mb-5">
          <h3 className="category-title mb-3">{title}</h3>
          <MovieCarousel movies={movies} />
        </div>
      ))}
    </div>
  );
};

export default RecommendationSection;