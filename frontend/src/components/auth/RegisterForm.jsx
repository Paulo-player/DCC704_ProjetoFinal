import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/auth';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Username might be taken.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      {/* Similar structure to LoginForm */}
      {/* Add registration-specific fields if needed */}
    </form>
  );
};

export default RegisterForm