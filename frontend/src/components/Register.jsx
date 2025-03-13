import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Se o usuário estiver logado, previne a navegação
      navigate("/user/home");
    }
  }, [navigate]);

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/auth/register", { username, password });
      alert("Registro bem-sucedido!");
      navigate("/login");
    } catch (error) {
      alert("Erro ao registrar");
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
}

export default Register;
