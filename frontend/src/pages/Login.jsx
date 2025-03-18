import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      navigate("/recommendations");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthForm
      title="Login"
      fields={[
        { type: "text", placeholder: "Username", name: "username", value: formData.username, onChange: handleChange },
        { type: "password", placeholder: "Password", name: "password", value: formData.password, onChange: handleChange },
      ]}
      buttonText="Login"
      onSubmit={handleSubmit}
      error={error}
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Sign up"
    />
  );
};

export default Login;
