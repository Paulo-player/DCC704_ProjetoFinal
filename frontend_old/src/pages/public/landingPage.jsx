import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <h1>Movie Recommendations</h1>
      <div className="auth-buttons">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
      </div>
    </div>
  );
}