// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa'; // Import icon from react-icons
import Sidebar from './Sidebar';
import preview1 from '../assets/Preview.PNG';
import preview2 from '../assets/Preview2.PNG';
import preview3 from '../assets/Preview3.PNG';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const setIsMobile = useState(window.innerWidth < 768);

  // Image list for carousel
  const images = [preview1, preview2, preview3];

  // Image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Adjust sidebar based on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar only visible on larger screens */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 text-gray-800 p-4 lg:p-16 flex flex-col items-center">
        {/* Welcome Message */}
        <div className="w-full max-w-3xl text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to the Dashboard!</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start w-full max-w-6xl space-y-8 md:space-y-0 md:space-x-12">
          {/* Left Side - Image Carousel */}
          <div className="w-full md:w-2/5 flex flex-col items-center space-y-4">
            <h2 className="text-lg font-semibold mb-2">Templates</h2>
            <div className="w-full overflow-hidden relative">
              <div
                className="flex transition-transform ease-in-out duration-700"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`carousel-${index}`}
                    className="w-full md:w-12/12 object-cover cursor-pointer rounded-lg shadow-md"
                    onClick={() => navigate('/templates')}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Instructions and Button */}
          <div className="w-full md:w-3/5 flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
            <h2 className="text-lg font-semibold mb-2">How It Works</h2>
            <ul className="text-gray-700 list-disc pl-5">
              <li>Choose your templates</li>
              <li>Customize according to your needs</li>
              <li>Download your creation</li>
              <li>Save and access later in profile</li>
            </ul>

            {/* Create Button with Icon */}
            <button
              onClick={() => navigate('/templates')}
              className="mt-6 px-6 py-3 bg-transparent text-black rounded-full shadow-lg  transition duration-300 flex items-center space-x-2"
            >
              <FaPlusCircle className="text-lg" />
              <span>Create Your Own Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
