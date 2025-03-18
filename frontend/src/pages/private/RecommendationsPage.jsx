import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRecommendations } from '../../services/recommendations';
import RecommendationSection from '../../components/recommendations/RecommendationSection';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RecommendationsPage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        if (user) {
          const data = await getRecommendations(user.accessToken);
          setRecommendations(data);
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Personalized Recommendations</h1>
      {recommendations && Object.entries(recommendations).map(([title, movies]) => (
        <RecommendationSection 
          key={title}
          title={title}
          movies={movies}
        />
      ))}
    </div>
  );
};

export default RecommendationsPage