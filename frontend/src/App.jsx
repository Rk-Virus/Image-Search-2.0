import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Home from '../components/Home'
import './index.css'
import Login from '../components/Login'
import Register from '../components/Register'

export default function App() {
  const user = false; // Change this based on your auth logic

  return (
    <div className="min-h-screen flex flex-col">
      <Router>
          <Routes>
            <Route path="/" element={<Home /> } />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Router>
    </div>
  )
}
