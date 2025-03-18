import React, { useState } from "react";

const AuthForm = ({ title, fields, buttonText, onSubmit, footerText, footerLink, footerLinkText, errorMessage }) => {
  // Inicializa o estado com os campos definidos no formulário
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, formData); // Garante que os dados são passados corretamente
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{title}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <input
              key={index}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              className="auth-input"
              value={formData[field.name]} // Garante que os valores são controlados
              onChange={handleChange}
              required
            />
          ))}
          <button type="submit" className="auth-button">{buttonText}</button>
        </form>
        <p className="auth-link">
          {footerText} <a href={footerLink}>{footerLinkText}</a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
