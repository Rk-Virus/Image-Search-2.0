import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function NavBar() {
  const [user, setUser] = useState(null); // set to { name: 'Ravi' } to simulate logged in

  const handleLogout = () => setUser(null);

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
            <span className="text-gray-700">Welcome, {user}</span>
            <button className="px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
              Logout
            </button>
          </div>
          </>
        ) : (
          <>
            <NavLink 
              to="/login"
              className={({ isActive }) => 
                `px-3 py-1 rounded-md ${
                  isActive 
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
                `px-3 py-1 rounded-md border ${
                  isActive 
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