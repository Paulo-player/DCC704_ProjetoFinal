import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";

// Componentes
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import LandingPage from "./components/LandingPage";

function App() {
  const { isAuthenticated } = useContext(AuthContext); // Agora isso não dará erro

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/user/home" /> : <LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
