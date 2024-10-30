// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import preview1 from '../assets/Preview.PNG';
import preview2 from '../assets/Preview2.PNG';
import preview3 from '../assets/Preview3.PNG';
const Dashboard = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image list for carousel
  const images = [
    preview1, // Update with actual image paths
   preview2,
   preview3
  ];

  // Image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-16 space-y-6">
        <div className="bg-white p-6 shadow-lg w-full max-w-xl rounded-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h1>
        </div>

        {/* Image Carousel */}
        <div className="w-full max-w-xl overflow-hidden relative">
          <div
            className="flex transition-transform ease-in-out duration-700"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`carousel-${index}`}
                className="w-full object-cover cursor-pointer"
                onClick={() => navigate('/templates')}
              />
            ))}
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={() => navigate('/templates')}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Create Your Own Card
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
