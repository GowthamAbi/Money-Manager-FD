import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from "jwt-decode"; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Function to check if the token is valid
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000; // Expiry check
    } catch (err) {
      return false; // Invalid token
    }
  };

  // ✅ Redirect if already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (storedToken && isTokenValid(storedToken)) {
      navigate('/dashboard'); 
    } else {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  }, [navigate]);

  // ✅ Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log({ email, password})
      const response = await api.post('/api/auth/login', { email, password });

      if (response.status === 200 && response.data.token) {
        const token = response.data.token;

        // ✅ Store token in localStorage (or sessionStorage)
        localStorage.setItem('authToken', token);

        navigate('/dashboard'); // Redirect after login
      } else {
        setError(response.data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Failed to log in. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ✅ Full-Width Section for Login */}
      <section className="flex flex-1 items-center justify-center w-full bg-gray-50 dark:bg-gray-400">
        <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-lg shadow-lg p-8 dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Sign in to your account
          </h1>
          
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* ✅ Email Input */}
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* ✅ Password Input */}
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {/* ✅ Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Sign in
            </button>

            {/* ✅ Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* ✅ Register Link */}
            <p className="text-center text-gray-600 dark:text-gray-400">
              Don't have an account? <a href="/register" className="text-blue-600 hover:underline dark:text-blue-400">Sign up</a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
