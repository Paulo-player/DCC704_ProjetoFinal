import NavLink from "../components/NavLink";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Bem-vindo ao Sistema de Recomendação de Filmes</h1>
      <p>Descubra filmes incríveis com base nos seus gostos!</p>
      <div className="landing-buttons">
        <NavLink to="/login" text="Entrar" />
        <NavLink to="/register" text="Cadastrar" />
      </div>
    </div>
  );
};

export default LandingPage;
