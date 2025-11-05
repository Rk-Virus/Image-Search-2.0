import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register/', formData, {
        withCredentials: true,
      });

      console.log('Response from server:', res);
      
      if (res.status === 201 || res.status === 200) {
        console.log('Registration successful:', res.data);
        navigate('/login'); // Redirect after successful registration
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      console.error('Error during registration:', error);
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    // Directly redirect to the server's Google auth endpoint
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  const handleGithubLogin = (e) => {
    e.preventDefault();
    window.location.href = 'http://localhost:5001/api/auth/github';
  };

  const handleFacebookLogin = (e) => {
    e.preventDefault();
    window.location.href = 'http://localhost:5001/api/auth/facebook';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create account</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-1">
              Full name
            </label>
            <input
              id="name"
              name="name"
              // type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email address
            </label>
            <input
              id="email"
              name="username"
              type="email"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </form>

         <div className="flex items-center my-4">
          <hr className="flex-1 border-t border-gray-200" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <hr className="flex-1 border-t border-gray-200" />
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 border rounded p-2 bg-white hover:bg-gray-50 text-sm cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M21.35 11.1h-9.3v2.7h5.35c-.23 1.45-1.53 4.25-5.35 4.25-3.22 0-5.85-2.65-5.85-5.92s2.63-5.92 5.85-5.92c1.84 0 3.07.79 3.77 1.47l2.57-2.48C17.6 3.1 15.7 2.2 12 2.2 6.7 2.2 2.15 6.75 2.15 12s4.55 9.8 9.85 9.8c5.7 0 9.65-4 9.65-9.9 0-.66-.08-1.16-.3-1.8z" fill="#4285F4"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-3 border rounded p-2 bg-white hover:bg-gray-50 text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.3c0-2.2 1.3-3.4 3.3-3.4.96 0 1.97.17 1.97.17v2.2h-1.13c-1.12 0-1.46.69-1.46 1.4v1.67h2.5l-.4 2.9h-2.1v7A10 10 0 0022 12z" fill="#1877F2"/>
            </svg>
            Continue with Facebook
          </button>

          <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-3 border rounded p-2 bg-white hover:bg-gray-50 text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 .5A12 12 0 001.8 17.2c.4.75.9 1.55 1.6 2.15.2.15.35.25.55.25.35 0 .5-.25.5-.5v-1.9c-2.45.55-2.95-1.15-2.95-1.15-.4-1.05-1-1.3-1-1.3-.8-.55.05-.55.05-.55.9.05 1.4.95 1.4.95.75 1.3 2 1 2.5.75.05-.55.3-.95.55-1.15-2-.2-4.1-1-4.1-4.45 0-.95.35-1.75.95-2.4-.1-.25-.4-1.25.1-2.6 0 0 .8-.25 2.6.9.75-.2 1.55-.35 2.35-.35s1.6.1 2.35.35c1.8-1.15 2.6-.9 2.6-.9.5 1.35.2 2.35.1 2.6.6.65.95 1.45.95 2.4 0 3.45-2.1 4.25-4.1 4.45.3.25.55.75.55 1.5v2.25c0 .25.15.5.55.5.2 0 .35-.1.55-.25.7-.6 1.2-1.4 1.6-2.15A12 12 0 0012 .5z" fill="#111"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

       
      </div>
    </div>
  );
}