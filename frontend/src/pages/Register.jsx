import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, passwordConfirm);
      navigate('/items');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <InputField
          label="Confirm Password"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Confirm your password"
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </div>
  );
};

export default Register;
