import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Header from './components/ui/Header';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import HomePage from './pages/private/HomePage';
import RecommendationsPage from './pages/private/RecommendationsPage';
import MovieDetailPage from './pages/private/MovieDetailPage';
import ProfilePage from './pages/private/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App