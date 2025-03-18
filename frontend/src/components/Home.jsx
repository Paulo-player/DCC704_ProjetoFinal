import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

function MovieCarousel({ title, movies }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const baseUrl = "https://image.tmdb.org/t/p/w500"; // Define o caminho base para os pôsteres

  return (
    <div className="carousel-container">
      <h3 className="category-title">{title}</h3>
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie.tmdb_id || movie._id} className="movie-card">
            <img 
              src={movie.poster_path ? `${baseUrl}${movie.poster_path}` : "/placeholder.jpg"} 
              alt={movie.title} 
              className="movie-image" 
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </Slider>
    </div>
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

        console.log("🔍 Resposta da API:", response.data);

        if (!response.data || Object.keys(response.data).length === 0) {
          setError("Nenhuma recomendação disponível.");
        } else {
          setRecommendations(response.data.recommendations || response.data);
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
    <div className="home-container">
      <Navbar onLogout={handleLogout} />
      <h1 className="home-title">Bem-vindo à Home</h1>

      {loading ? (
        <p>Carregando recomendações...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        Object.entries(recommendations).map(([category, movies]) =>
          Array.isArray(movies) && movies.length > 0 ? (
            <MovieCarousel key={category} title={category} movies={movies} />
          ) : null
        )
      )}
    </div>
  );
}

export default Home;
