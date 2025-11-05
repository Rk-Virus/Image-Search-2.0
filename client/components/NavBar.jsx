import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function NavBar({user, setUser}) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/auth/logout', {
        withCredentials: true,
      })
      console.log('Logged out successfully');
      if(res.status === 200){
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  const activeClassName = "text-blue-600 font-medium";

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? activeClassName : "text-gray-800"
          }
        >
          <div className="text-xl font-bold">Image Search 2.0</div>
        </NavLink>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-3">

              <span className="text-gray-700">Hi, {user?.name}</span>
              {/* Avatar beside name */}
              <img
                src={
                  user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=aaa&color=fff`
                }
                alt={`${user?.displayName || 'User'} avatar`}
                className='!h-10'
              />

              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-3 py-1 rounded-md ${isActive
                  ? "bg-blue-700 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-3 py-1 rounded-md border ${isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;