//Componente principal do frontend
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

//Componentes
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

function App() {
  const isAuthenticated = localStorage.getItem("accessToken");  //Verifica se o usuário está autenticado
  return (
    <Router>
      <Routes>
        {/* Caminhos das páginas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/user/home" : "/login"} />} /> {/*Usuário autenticado-> Página inicial | Usuário não autenticado -> Página de Login*/}
      </Routes>
    </Router>
  );
}

export default App;
