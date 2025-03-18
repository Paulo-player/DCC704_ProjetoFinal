import React, { useState } from "react";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e, formData) => {
    e.preventDefault();
    
    // Verifica se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <AuthForm
      title="Register"
      fields={[
        { name: "username", type: "text", placeholder: "Username" },
        { name: "password", type: "password", placeholder: "Password" },
        { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
      ]}
      buttonText="Register"
      onSubmit={handleRegister}
      errorMessage={errorMessage}
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login"
    />
  );
};

export default Register;
