// Navbar.js
import React, { useState } from 'react';
import { FaUser, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import firebaseConfig from "./connection_db";
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('username');
        navigate('/signup');
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="p-4 flex justify-between items-center bg-white shadow-md " >
      <div className="flex items-center">
        <img src="/assets/logo.png" alt="Company Logo" className="w-8 h-8 mr-2" />
        <span className="text-lg font-semibold">Visiting Card Generator</span>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center hover:text-gray-500"
        >
          <FaHome className="mr-2" />
          Home
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center hover:text-gray-500"
        >
          <FaUser className="mr-2" />
          Profile
        </button>
        <button onClick={handleLogout} className="flex items-center hover:text-gray-500">
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMobileMenu} className="focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white p-4 shadow-lg rounded-b-lg md:hidden" >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center mb-2 w-full hover:text-gray-500"
          >
            <FaHome className="mr-2" />
            Home
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center mb-2 w-full hover:text-gray-500"
          >
            <FaUser className="mr-2" />
            Profile
          </button>
          <button onClick={handleLogout} className="flex items-center w-full hover:text-gray-500">
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
