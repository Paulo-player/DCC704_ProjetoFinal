import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import "../styles/global.css";

const LandingPage = () => {
  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Bem-vindo ao Sistema de Recomendação de Filmes
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Descubra filmes incríveis com base nos seus gostos!
          </Typography>
          <div className="button-container">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              component={Link}
              to="/login"
              className="landing-button"
            >
              Entrar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              component={Link}
              to="/register"
              className="landing-button"
            >
              Cadastrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;
