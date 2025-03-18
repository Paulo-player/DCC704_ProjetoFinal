import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Componentes
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import LandingPage from "./components/LandingPage";

function App() {
  const isAuthenticated = localStorage.getItem("accessToken"); // Verifica se o usuário está autenticado
  
  return (
    <Router>
      <Routes>
        {/* Caminhos das páginas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        
        {/* Landing Page em "/" */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/user/home" /> : <LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
