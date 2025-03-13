import React from "react";
import { Button } from "@mui/material";
import { Link,useNavigate } from "react-router-dom";
import { Slider } from "@mui/material";

function Navbar({ onLogout }) {
  return (
    <nav>
      <Link to="/home">Home</Link>
      <Button variant="contained" color="secondary" onClick={onLogout}>
        Logout
      </Button>
    </nav>
  );
}

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const sliderData = [
    { title: "Filmes Populares", banners: ["Banner1", "Banner2", "Banner3"] },
    {
      title: "Usuários parecidos também gostaram de",
      banners: ["Banner4", "Banner5", "Banner6"],
    },
    {
      title: "Usuários parecidos assistiram",
      banners: ["Banner7", "Banner8", "Banner9"],
    },
    {
      title: "Filmes parecidos com",
      banners: ["Banner10", "Banner11", "Banner12"],
    },
  ];

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <h1>Bem-vindo à Home</h1>
      {sliderData.map((slider, index) => (
        <div key={index}>
          <h3>{slider.title}</h3>
          <Slider
            aria-labelledby="slider"
            value={0}
            valueLabelDisplay="auto"
            max={slider.banners.length - 1}
          />
          <div className="banners">
            {slider.banners.map((banner, idx) => (
              <div key={idx} className="banner">
                <button>{banner}</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
