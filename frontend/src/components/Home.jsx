import React from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ onLogout }) {
  return (
    <nav style={styles.navbar}>
      <Link to="/home" style={styles.navLink}>Home</Link>
      <Button variant="contained" color="secondary" onClick={onLogout} style={styles.logoutButton}>
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
    { title: "Filmes Populares", banners: Array(10).fill("Banner") },
    {
      title: "Usuários parecidos também gostaram de",
      banners: Array(10).fill("Banner"),
    },
    {
      title: "Usuários parecidos assistiram",
      banners: Array(10).fill("Banner"),
    },
    {
      title: "Filmes parecidos com",
      banners: Array(10).fill("Banner"),
    },
  ];

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <h1>Bem-vindo à Home</h1>
      {sliderData.map((slider, index) => (
        <div key={index}>
          <h3>{slider.title}</h3>
          <div className="banners" style={styles.banners}>
            {slider.banners.map((banner, idx) => (
              <div key={idx} className="banner" style={styles.banner}>
                <button>{banner}</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
  },
  logoutButton: {
    marginLeft: "auto",
  },
  banners: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "10px",
  },
  banner: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    textAlign: "center",
    borderRadius: "5px",
    width: "90px",
    height: "60px",
  },
};

export default Home;
