import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/user/home" className="navLink">Home</Link>
      <Button
        variant="contained"
        color="secondary"
        onClick={onLogout}
        className="logoutButton"
      >
        Logout
      </Button>
    </nav>
  );
}

function Home() {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
  
        const response = await axios.get("http://localhost:5000/api/recommendations/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Resposta da API:", response.data); // 🔍 Debug
  
        if (!response.data || Object.keys(response.data).length === 0) {
          setError("Nenhuma recomendação disponível.");
        } else {
          // Se o backend retorna apenas recomendações gerais, armazenamos elas corretamente
          const recommendationsData = response.data.recommendations || response.data;
          setRecommendations(recommendationsData);
        }
      } catch (error) {
        console.error("Erro ao obter recomendações:", error);
        setError("Erro ao carregar recomendações.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecommendations();
  }, [navigate]);
  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <h1>Bem-vindo à Home</h1>

      {loading ? (
        <p>Carregando recomendações...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        Object.entries(recommendations).map(([category, movies]) => (
          <div key={category} className="recommendation-section">
            <h3>{category}</h3>
            <div className="banners">
              {Array.isArray(movies) && movies.length > 0 ? (
                movies.map((movie) => (
                  <div key={movie._id} className="banner">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="bannerImage"
                    />
                  </div>
                ))
              ) : (
                <p>Nenhum filme disponível nesta categoria.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
