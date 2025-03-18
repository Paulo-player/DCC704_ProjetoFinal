import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remover tokens de autenticação (adapte conforme a lógica do projeto)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirecionar para a página de login
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Movie Recommender</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
