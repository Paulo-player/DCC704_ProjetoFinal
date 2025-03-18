import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-primary text-white py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-accent transition-colors">
          MovieRecs
        </Link>
        
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                to="/recommendations" 
                className="hover:text-accent transition-colors"
              >
                Recommendations
              </Link>
              <Link 
                to="/profile" 
                className="hover:text-accent transition-colors"
              >
                Profile
              </Link>
              <button 
                onClick={logout}
                className="hover:text-accent transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="hover:text-accent transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="hover:text-accent transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Header