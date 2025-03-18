/**
 * @file App.js
 * @description Componente principal que gerencia as rotas da aplicação e a navegação entre páginas.
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

//Componentes
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

/**
 * Componente principal da aplicação que define as rotas.
 * 
 * @component
 * @returns {JSX.Element} Retorna o JSX que define a navegação da aplicação.
 * 
 * @example
 * <App />
 */
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
