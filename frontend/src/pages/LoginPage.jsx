import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { Navigate } from 'react-router-dom';
import './css/cssloginpage/LoginPage.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    dispatch(loginUser(form)); 
  };

  
  if (user) {
    return <Navigate to="/protected" />;
  }
  console.log('User State:', user);

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          Se connecter
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
