import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, logoutUser } from '../redux/authSlice';
import { Link } from 'react-router-dom'; 
import { loginUser } from '../redux/authSlice';
import { Navigate } from 'react-router-dom';
import './css/csshomepage/HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch(registerUser(form));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  
  if (user) {
    return <Navigate to="/protected" />;
  }
  
  console.log('User State:', user);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>

      {!user ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            Register
          </button>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p>
            Vous avez déjà un compte?{' '}
            <Link to="/login">Login</Link> {/* Lien vers la page de connexion */}
          </p>
        </form>
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;

