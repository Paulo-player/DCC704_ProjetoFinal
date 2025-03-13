import { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material"; // Importando componentes do MUI

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", { username, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      alert("Login bem-sucedido!");
    } catch (error) {
      alert("Erro ao fazer login");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <TextField 
        label="Usuário" 
        variant="outlined" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        fullWidth 
        margin="normal"
      />
      <TextField 
        label="Senha" 
        type="password" 
        variant="outlined" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        fullWidth 
        margin="normal"
      />
      <Button 
        onClick={handleLogin} 
        variant="contained" 
        color="primary" 
        fullWidth
      >
        Entrar
      </Button>
    </div>
  );
}

export default Login;
