import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/home" className="navLink">
        Home
      </Link>
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
  const [popularMovies, setPopularMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/movies/popular"
        );
        if (Array.isArray(response.data)) {
          setPopularMovies(response.data);
        } else {
          console.error("Resposta inesperada:", response.data);
        }
      } catch (error) {
        console.error("Erro ao obter filmes populares:", error);
      }
    };

    fetchPopularMovies();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const sliderData = [
    {
      title: "Filmes Populares",
      banners: popularMovies.length > 0 ? popularMovies : Array(10).fill(null),
    },
    {
      title: "Usuários parecidos também gostaram de",
      banners: Array(10).fill(null),
    },
    {
      title: "Filmes parecidos com",
      banners: Array(10).fill(null),
    },
  ];

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <h1>Bem-vindo à Home</h1>
      {sliderData.map((slider, index) => (
        <div key={index}>
          <h3>{slider.title}</h3>
          <div className="banners">
            {slider.banners.map((banner, idx) => (
              <div key={idx} className="banner">
                {banner && banner.posterUrl ? (
                  <img
                    src={banner.posterUrl} // <-- Update this to banner.posterUrl
                    alt={banner.title || "Filme"}
                    className="bannerImage"
                  />
                ) : (
                  <div className="placeholderBanner">Carregando...</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
